import {File} from '../abstracts/file.js'
import {Metadata} from './Metadata.js'
import * as Schemas from '../../../schemas/index.js'

export class PdfIncompatibleHashEntriesError extends Error {
	constructor(message = 'The provided hash entries are not compatible with a reMarkable PDF file.') {
		super(message)
		this.name = 'PdfIncompatibleHashEntriesError'
	}
}

/**
 * Class representing a reMarkable PDF file.
 *
 * Abstracts the logic for manipulating PDF files
 * on the reMarkable API, allowing us to download,
 * rename, or move PDF files in the reMarkable cloud.
 */
export class Document extends File {
	/**
	 * Fetches PDF hash entries from PDF root hash entry
	 * and returns its equivalent PdfFile instance.
	 *
	 * @param {root} root - reMarkable Cloud root snapshot.
	 * @param {HashEntry} rootHashEntry - The root hash entry representing the PDF file.
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<Document>}
	 */
	static async fromHashEntry(root, rootHashEntry, session) {
		const hashEntriesPayload = await rootHashEntry.content(session)

		return await this.fromHashEntries(root, rootHashEntry, Schemas.HashEntriesFactory.fromPayload(hashEntriesPayload), session)
	}

	/**
	 * Returns a PdfFile instance from the provided
	 * hash entries representing the PDF file content.
	 *
	 * @param {Root} root - reMarkable Cloud root snapshot.
	 * @param {HashEntry} rootHashEntry - The root hash entry representing the PDF file.
	 * @param {HashEntries} hashEntries - The hash entries representing the PDF file content.
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<Document>}
	 */
	static async fromHashEntries(root, rootHashEntry, hashEntries, session) {
		if (!this.compatibleWithHashEntries(hashEntries))
			throw new PdfIncompatibleHashEntriesError()

		const pdfMetadataPayload =
			await hashEntries.hashEntriesList
				.find(hashEntry => hashEntry.fileExtension === 'metadata')
				.content(session)

		const pdfMetadata = new Metadata(rootHashEntry, pdfMetadataPayload)

		return new Document(root, rootHashEntry, hashEntries, pdfMetadata)
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
						!hashEntries.hashEntriesList.some(hashEntry => hashEntry.fileExtension === 'epub')
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
	 * @returns {Metadata}
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
	 * Renames the PDF file in the reMarkable cloud.
	 *
	 * @param {String} newName - The new name for the PDF file.
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<Document>}
	 */
	async rename(newName, session) {
		const newPdfMetadataHashEntry =
			await this.metadata.update({ visibleName: newName }, session)

		return await this.updateHashEntryToFileHashEntries(newPdfMetadataHashEntry, session)
	}

	/**
	 * Moves the PDF file to a specified folder in the reMarkable cloud.
	 *
	 * @param {String} destinationFolderId - The ID of the destination folder.
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<Document>}
	 */
	async moveToFolder(destinationFolderId, session) {
		const newPdfMetadataHashEntry =
			await this.metadata.update({ parent: destinationFolderId }, session)

		return await this.updateHashEntryToFileHashEntries(newPdfMetadataHashEntry, session)
	}

	/**
	 * Moves the PDF file to the trash folder in the reMarkable cloud.
	 * This is the equivalent of removing a file in the reMarkable cloud.
	 *
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<Document>}
	 */
	async moveToTrash(session) {
		return await this.moveToFolder('trash', session)
	}
}
