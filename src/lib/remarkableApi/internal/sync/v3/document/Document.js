import {File} from '../abstracts/file.js'
import {Metadata} from './Metadata.js'
import * as Schemas from '../../../schemas'

export class DocumentIncompatibleHashEntriesError extends Error {
	constructor(message = 'The provided hash entries are not compatible with a reMarkable document.') {
		super(message)
		this.name = 'DocumentIncompatibleHashEntriesError'
	}
}

/**
 * Class representing a reMarkable Document.
 *
 * Abstracts the logic for manipulating Documents
 * on the reMarkable API, allowing us to download,
 * rename, or move Documents in the reMarkable cloud.
 */
export class Document extends File {
	/**
	 * Fetches Document hash entries from Document root hash entry
	 * and returns its equivalent PdfFile instance.
	 *
	 * @param {HashEntry} rootHashEntry - The root hash entry representing the Document.
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Document}
	 */
	static async fromHashEntry(rootHashEntry, session) {
		const hashEntriesPayload = await rootHashEntry.content(session)

		return this.fromHashEntries(rootHashEntry, Schemas.HashEntriesFactory.fromPayload(hashEntriesPayload), session);
	}

	/**
	 * Returns a Document instance from the provided
	 * hash entries representing the Document content.
	 *
	 * @param {HashEntry} rootHashEntry - The root hash entry representing the Document.
	 * @param {HashEntries} hashEntries - The hash entries representing the Document content.
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Document}
	 */
	static async fromHashEntries(rootHashEntry, hashEntries, session) {
		if (!this.compatibleWithHashEntries(hashEntries))
			throw new DocumentIncompatibleHashEntriesError()

		const pdfMetadataPayload =
			await hashEntries.hashEntriesList
				.find(hashEntry => hashEntry.fileExtension === 'metadata')
				.content(session)

		const pdfMetadata = new Metadata(rootHashEntry, pdfMetadataPayload)

		return new Document(rootHashEntry, hashEntries, pdfMetadata)
	}

	/**
	 * Returns true if the provided hash entries resemble a reMarkable Document.
	 *
	 * @param {HashEntries} hashEntries - The hash entries to check for compatibility.
	 * @returns {boolean}
	 */
	static compatibleWithHashEntries(hashEntries) {
		return 	hashEntries.hashEntriesList.some(hashEntry => hashEntry.fileExtension === 'metadata') &&
						hashEntries.hashEntriesList.some(hashEntry => hashEntry.fileExtension === 'pagedata') &&
						hashEntries.hashEntriesList.some(hashEntry => hashEntry.fileExtension === 'content')
	}

	/**
	 * Returns the file name of the Document.
	 *
	 * @returns {String}
	 */
	get name() {
		return this.metadata.fileName
	}

	/**
	 * Renames the Document in the reMarkable cloud.
	 *
	 * @param {String} newName - The new name for the PDF file.
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<File>}
	 */
	async rename(newName, session) {
		const newDocumentMetadataHashEntry =
			await this.metadata.update({ visibleName: newName }, session)

		return this.upsertFileHashEntryToNewRootGeneration(newDocumentMetadataHashEntry, session)
	}

	/**
	 * Moves the Document to a specified folder in the reMarkable cloud.
	 *
	 * @param {String} destinationFolderId - The ID of the destination folder.
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<Document>}
	 */
	async moveToFolder(destinationFolderId, session) {
		const newDocumentMetadataHashEntry =
			await this.metadata.update({ parent: destinationFolderId }, session)

		return this.upsertFileHashEntryToNewRootGeneration(newDocumentMetadataHashEntry, session)
	}

	/**
	 * Moves the Document to the trash folder in the reMarkable cloud.
	 * This is the equivalent of removing a file in the reMarkable cloud.
	 *
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<Document>}
	 */
	async moveToTrash(session) {
		return await this.moveToFolder('trash', session)
	}
}
