import {File} from '../abstracts'
import {EpubMetadata} from './epubMetadata'
import {HashEntriesFactory} from '../../../../schemas'

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
export class EpubFile extends File {
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

		return await this.fromHashEntries(root, rootHashEntry, HashEntriesFactory.fromPayload(hashEntriesPayload), session)
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
		super()

		this.#root = root
		this.#rootHashEntry = rootHashEntry
		this.#hashEntries = hashEntries
		this.#metadata = metadata
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
	get name() {
		return this.metadata.fileName
	}

	/**
	 * Renames the ePub file in the reMarkable cloud.
	 *
	 * @param {String} newName - The new name for the PDF file.
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<EpubFile>}
	 */
	async rename(newName, session) {
		const newEpubMetadataHashEntry =
			await this.metadata.update({ visibleName: newName }, session)

		return await this.updateHashEntryToFileHashEntries(newEpubMetadataHashEntry, session)
	}

	/**
	 * Moves the PDF file to a specified folder in the reMarkable cloud.
	 *
	 * @param {String} destinationFolderId - The ID of the destination folder.
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<EpubFile>}
	 */
	async moveToFolder(destinationFolderId, session) {
		const newEpubMetadataHashEntry =
			await this.metadata.update({ parent: destinationFolderId }, session)

		return await this.updateHashEntryToFileHashEntries(newEpubMetadataHashEntry, session)
	}

	/**
	 * Moves the ePub file to the trash folder in the reMarkable cloud.
	 * This is the equivalent of removing a file in the reMarkable cloud.
	 *
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<EpubFile>}
	 */
	async moveToTrash(session) {
		return await this.moveToFolder('trash', session)
	}
}
