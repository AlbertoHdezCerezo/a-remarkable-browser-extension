import {FetchBasedHttpClient} from '../../../../../../utils/httpClient'
import {CONFIGURATION} from '../../../../../configuration'
import {RequestBuffer} from '../../utils'
import {Root} from '../../../root'

/**
 * Abstract class representing a file
 * or folder in the Remarkable API.
 *
 * Abstracts the logic for handling
 * documents and folders across
 * the Remarkable API data models.
 */
export class File {
	static fromHashEntry(root, rootHashEntry, session) {
		throw new Error('Method fromHashEntry() must be implemented')
	}

	constructor() {
		if (new.target === File) {
			throw new Error('Cannot instantiate abstract class File directly')
		}
	}

	/**
	 * Returns the file extension of the file/folder.
	 *
	 * @returns {String}
	 */
	get extension() {
		switch (this.constructor.name) {
			case 'PdfFile':
				return 'pdf'
			case 'EpubFile':
				return 'epub'
			case 'Folder':
				return 'folder'
			default:
				throw new Error(`Unknown file type: ${this.constructor.name}`)
		}
	}

	/**
	 * Returns root hash entry representing the file/folder.
	 *
	 * @returns {HashEntry}
	 */
	get root() {
		throw new Error('Method root() must be implemented')
	}

	/**
	 * Returns root hash entry representing the file/folder.
	 *
	 * @returns {HashEntry}
	 */
	get rootHashEntry() {
		throw new Error('Method rootHashEntry() must be implemented')
	}

	/**
	 * Returns hash entries representing the file/folder content.
	 *
	 * @returns {HashEntries}
	 */
	get hashEntries() {
		throw new Error('Method hashEntries() must be implemented')
	}

	/**
	 * Returns file/folder metadata.
	 *
	 * @returns {PdfMetadata}
	 */
	get metadata() {
		throw new Error('Method metadata() must be implemented')
	}

	/**
	 * Returns the file name of the file/folder.
	 *
	 * @returns {String}
	 */
	get name() {
		throw new Error('Method name() must be implemented')
	}

	/**
	 * Updates reMarkable cloud file hash entries with a new hash entry.
	 *
	 * @param {HashEntry} newFileHashEntry - The new file hash entry, to attach to hash entries.
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<File>}
	 */
	async updateHashEntryToFileHashEntries(newFileHashEntry, session) {
		const newFileHashEntries =
			this.hashEntries.replace(
				this.hashEntries.hashEntriesList.find(entry => entry.fileExtension === 'metadata'),
				newFileHashEntry
			)

		return await this.updateFileHashEntries(newFileHashEntries, session)
	}

	/**
	 * Updates reMarkable cloud file hash entries with the new set of hash entries.
	 *
	 * @param {HashEntries} newFileHashEntries - The new root hash entries.
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<File>}
	 */
	async updateFileHashEntries(newFileHashEntries, session) {
		const newFileHashEntriesRequestBuffer = newFileHashEntries.asRequestBuffer()
		const newFileHashEntriesChecksum = await newFileHashEntriesRequestBuffer.checksum()
		const newFileHashEntry = await newFileHashEntries.hashEntry()

		const updateRequestHeaders = {
			'authorization': `Bearer ${session.token}`,
			'content-type': 'text/plain; charset=UTF-8',
			'rm-filename': `${this.rootHashEntry.fileId}.docSchema`,
			'x-goog-hash': `crc32c=${newFileHashEntriesRequestBuffer.crc32Hash}`,
		}

		await FetchBasedHttpClient.put(
			CONFIGURATION.endpoints.sync.v3.endpoints.files + newFileHashEntriesChecksum,
			newFileHashEntriesRequestBuffer.payload,
			updateRequestHeaders,
		)

		let newRootHashEntries = null

		if (this.root.hashEntries.hashEntriesList.some(entry => entry.checksum === this.rootHashEntry.checksum)) {
			newRootHashEntries = this.root.hashEntries.replace(
				this.root.hashEntries.hashEntriesList.find(entry => entry.checksum === this.rootHashEntry.checksum),
				newFileHashEntry
			)
		} else {
			newRootHashEntries = this.root.hashEntries.attach(newFileHashEntry)
		}

		const updatedRoot = await this.#updateRootHashEntries(newRootHashEntries, session)

		return this.constructor.fromHashEntry(updatedRoot, newFileHashEntry, session)
	}

	/**
	 * Updates reMarkable cloud root hash entries with the new set of hash entries.
	 *
	 * @param {HashEntries} newRootHashEntries - The new root hash entries.
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<HashEntry>}
	 */
	async #updateRootHashEntries(newRootHashEntries, session) {
		const newRootHashRequestBuffer = newRootHashEntries.asRequestBuffer()
		const newRootHashEntriesChecksum = await newRootHashRequestBuffer.checksum()

		const updateRequestHeaders = {
			'authorization': `Bearer ${session.token}`,
			'content-type': 'text/plain; charset=UTF-8',
			'rm-filename': `root.docSchema`,
			'x-goog-hash': `crc32c=${newRootHashRequestBuffer.crc32Hash}`,
		}

		await FetchBasedHttpClient.put(
			CONFIGURATION.endpoints.sync.v3.endpoints.files + newRootHashEntriesChecksum,
			newRootHashRequestBuffer.payload,
			updateRequestHeaders,
		)

		return await this.#updateRoot(newRootHashEntriesChecksum, session)
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
	 * @param {String} newRootHashEntriesChecksum - The new root hash entries checksum.
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<Root>}
	 */
	async #updateRoot(newRootHashEntriesChecksum, session) {
		const newRootPayload = {
			broadcast: true,
			generation: this.root.generation,
			hash: newRootHashEntriesChecksum
		}

		const newRootBuffer = new RequestBuffer(newRootPayload)

		const updateRequestHeaders = {
			'authorization': `Bearer ${session.token}`,
			'content-type': 'application/json',
			'rm-filename': `roothash`,
			'x-goog-hash': `crc32c=${newRootBuffer.crc32Hash}`,
		}

		await FetchBasedHttpClient.put(
			CONFIGURATION.endpoints.sync.v3.endpoints.root,
			newRootPayload,
			updateRequestHeaders
		)

		// TODO: I should fetch the root from the checksum present in the response
		return await Root.fromSession(session)
	}
}