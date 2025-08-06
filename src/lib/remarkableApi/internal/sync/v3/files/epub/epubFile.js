import {CONFIGURATION} from '../../../../../configuration'
import EpubMetadata from './epubMetadata'
import RequestBuffer from '../../utils/requestBuffer'
import {HashEntry} from '../../../../schemas/v4/hashEntry'
import {HashEntries} from '../../../../schemas/v4/hashEntries'
import FetchBasedHttpClient from '../../../../../../utils/httpClient/fetchBasedHttpClient'

export class EpubIncompatibleHashEntriesError extends Error {
	constructor(message = 'The provided hash entries are not compatible with a reMarkable ePub file.') {
		super(message)
		this.name = 'EpubIncompatibleHashEntriesError'
	}
}

/**
 * Class representing a reMarkable ePub file.
 *
 * Abstracts the logic for manipulating ePub files
 * on the reMarkable API, allowing us to download,
 * rename, or move ePub files in the reMarkable cloud.
 */
export default class EpubFile {
	/**
	 * Fetches ePub hash entries from ePub root hash entry
	 * and returns its equivalent EpubFile instance.
	 *
	 * @param {root} root - reMarkable Cloud root snapshot.
	 * @param {HashEntry} rootHashEntry - The root hash entry representing the ePub file.
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<EpubFile>}
	 */
	static async fromHashEntry(root, rootHashEntry, session) {
		const hashEntriesPayload = await rootHashEntry.content(session)

		return await this.fromHashEntries(root, rootHashEntry, new HashEntries(hashEntriesPayload), session)
	}

	/**
	 * Returns an EpubFile instance from the provided
	 * hash entries representing the ePub file content.
	 *
	 * @param {Root} root - reMarkable Cloud root snapshot.
	 * @param {HashEntry} rootHashEntry - The root hash entry representing the ePub file.
	 * @param {HashEntries} hashEntries - The hash entries representing the ePub file content.
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<EpubFile>}
	 */
	static async fromHashEntries(root, rootHashEntry, hashEntries, session) {
		if (!this.compatibleWithHashEntries(hashEntries))
			throw new EpubIncompatibleHashEntriesError()

		const epubMetadataPayload =
			await hashEntries.hashEntriesList
				.find(hashEntry => hashEntry.fileExtension === 'metadata')
				.content(session)

		const epubMetadata = new EpubMetadata(rootHashEntry, epubMetadataPayload)

		return new EpubFile(root, rootHashEntry, hashEntries, epubMetadata)
	}

	/**
	 * Returns true if the provided hash entries resemble a reMarkable PDF file.
	 *
	 * @param {HashEntries} hashEntries - The hash entries to check for compatibility.
	 * @returns {boolean}
	 */
	static compatibleWithHashEntries(hashEntries) {
		return 	hashEntries.hashEntriesList.some(hashEntry => hashEntry.fileExtension === 'metadata') &&
						hashEntries.hashEntriesList.some(hashEntry => hashEntry.fileExtension === 'pagedata') &&
						hashEntries.hashEntriesList.some(hashEntry => hashEntry.fileExtension === 'content') &&
						hashEntries.hashEntriesList.some(hashEntry => hashEntry.fileExtension === 'pdf') &&
						hashEntries.hashEntriesList.some(hashEntry => hashEntry.fileExtension === 'epub')
	}

	/**
	 * reMarkable Cloud root snapshot.
	 *
	 * @type {Root}
	 */
	#root

	/**
	 * Hash entry from root hash entries representing the PDF file.
	 *
	 * @type {HashEntry}
	 */
	#rootHashEntry

	/**
	 * Hash entries representing the PDF file content.
	 *
	 * @type {HashEntries}
	 */
	#hashEntries

	/**
	 * PDF file metadata
 	 */
	#metadata

	constructor(root, rootHashEntry, hashEntries, metadata) {
		this.#root = root
		this.#rootHashEntry = rootHashEntry
		this.#hashEntries = hashEntries
		this.#metadata = metadata
	}

	/**
	 * Returns the file extension of the ePub file.
	 *
	 * @returns {string}
	 */
	get extension() {
		return 'epub'
	}

	/**
	 * Returns the reMarkable Cloud root snapshot.
	 *
	 * @returns {Root}
	 */
	get root() {
		return this.#root
	}

	/**
	 * Returns root hash entry representing the PDF file.
	 *
	 * @returns {HashEntry}
	 */
	get rootHashEntry() {
		return this.#rootHashEntry
	}

	/**
	 * Returns hash entries representing the PDF file content.
	 *
	 * @returns {HashEntries}
	 */
	get hashEntries() {
		return this.#hashEntries
	}

	/**
	 * Returns PDF file metadata.
	 *
	 * @returns {PdfMetadata}
	 */
	get metadata() {
		return this.#metadata
	}

	/**
	 * Returns the file name of the PDF file.
	 *
	 * @returns {String}
	 */
	get fileName() {
		return this.metadata.fileName
	}

	async rename(newName, session) {
		const newPdfMetadataHashEntry =
			await this.metadata.update({ visibleName: newName }, session)

		const newPdfHashEntries =
			this.hashEntries.replace(
				this.hashEntries.hashEntriesList.find(entry => entry.fileExtension === 'metadata'),
				newPdfMetadataHashEntry
			)

		const newRootPdfFileHashEntry =
			await this.#updatePdfFileHashEntries(newPdfHashEntries, session)

		const newRootHashEntries =
			this.root.hashEntries.replace(
				this.root.hashEntries.hashEntriesList.find(entry => entry.hash === this.rootHashEntry.hash),
				newRootPdfFileHashEntry
			)

		const newRootChecksum = await this.#updateRootHashEntries(newRootHashEntries, session)

		return await this.#updateRoot(newRootChecksum, session)
	}

	async #updatePdfFileHashEntries(newPdfHashEntries, session) {
		const newPdfFileHashEntriesRequestBuffer = newPdfHashEntries.asRequestBuffer()

		const updateRequestHeaders = {
			'authorization': `Bearer ${session.token}`,
			'content-type': 'text/plain; charset=UTF-8',
			'rm-filename': `${this.rootHashEntry.fileId}.docSchema`,
			'x-goog-hash': `crc32c=${newPdfFileHashEntriesRequestBuffer.crc32Hash}`,
		}

		const newPdfFileHashEntriesChecksum = await newPdfFileHashEntriesRequestBuffer.checksum()

		await FetchBasedHttpClient.put(
			CONFIGURATION.endpoints.sync.v3.endpoints.files + newPdfFileHashEntriesChecksum,
			newPdfFileHashEntriesRequestBuffer.payload,
			updateRequestHeaders,
		)

		return new HashEntry(
			`${newPdfFileHashEntriesChecksum}:0:${this.rootHashEntry.fileId}:${newPdfHashEntries.hashEntriesList.length}:${newPdfHashEntries.sizeInBytesFromHashEntries}`
		)
	}

	/**
	 * Updates reMarkable cloud root hash entries with the new set of hash entries.
	 *
	 * @param {HashEntries} newRootHashEntries - The new root hash entries to update.
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<String>}
	 */
	async #updateRootHashEntries(newRootHashEntries, session) {
		const newRootHashRequestBuffer = newRootHashEntries.asRequestBuffer()

		const newRootHashChecksum = await newRootHashRequestBuffer.checksum()

		const updateRequestHeaders = {
			'authorization': `Bearer ${session.token}`,
			'content-type': 'text/plain; charset=UTF-8',
			'rm-filename': `root.docSchema`,
			'x-goog-hash': `crc32c=${newRootHashRequestBuffer.crc32Hash}`,
		}

		await FetchBasedHttpClient.put(
			CONFIGURATION.endpoints.sync.v3.endpoints.files + newRootHashChecksum,
			newRootHashRequestBuffer.payload,
			updateRequestHeaders,
		)

		return newRootHashChecksum
	}

	/**
	 * Updates reMarkable cloud root snapshot.
	 *
	 * Given a new checksum representing the new root hash
	 * entries, defines a new generation of the root with
	 * the new set of hash entries attached to it, becoming
	 * the new default snapshot root of the reMarkable cloud
	 * account.
	 *
	 * @param {String} newRootHash - The new root hash representing the new root hash entries.
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<any>}
	 */
	async #updateRoot(newRootHash, session) {
		const newRootPayload = {
			broadcast: true,
			generation: this.root.generation,
			hash: newRootHash
		}

		const newRootBuffer = new RequestBuffer(newRootPayload)

		const updateRequestHeaders = {
			'authorization': `Bearer ${session.token}`,
			'content-type': 'application/json',
			'rm-filename': `roothash`,
			'x-goog-hash': `crc32c=${newRootBuffer.crc32Hash}`,
		}

		const newRootResponse = await FetchBasedHttpClient.put(
			CONFIGURATION.endpoints.sync.v3.endpoints.root,
			newRootPayload,
			updateRequestHeaders
		)

		return (await newRootResponse.json())
	}
}
