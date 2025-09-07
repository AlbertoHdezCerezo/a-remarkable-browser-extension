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
	 * Document extension based on hash entries file extension.
	 *
	 * @returns {String}
	 */
	get extension() {
		if(this.hashEntries.hashEntriesList.some(hashEntry => hashEntry.fileExtension === 'epub')) {
			return 'epub'
		} else {
			return 'pdf'
		}
	}

	/**
	 * Updates file attributes to synchronize them with
	 * the current version available in the reMarkable cloud.
	 *
	 * @param session
	 * @returns {Promise<File>}
	 */
	async refreshFile(session) {
		throw new Error('Method refreshFile() must be implemented')
	}
}
