import {HashEntriesFactory, HashEntryFactory} from '../internal/schemas/index'
import PdfFile from '../internal/sync/v3/files/pdf/pdfFile'
import EpubFile from '../internal/sync/v3/files/epub/epubFile'

export default class Document {
	/**
	 * Returns a Document instance from the provided
	 * JSON representation of the document.
	 *
	 * @param {String} documentJson - JSON representation of the document.
	 * @param {Root} root - reMarkable Cloud root.
	 * @returns {Document}
	 */
	static fromJson(documentJson, root) {
		const documentObject = JSON.parse(documentJson)
		const documentRootHashEntry = HashEntryFactory.fromPayload(documentObject.documentRootHashEntryPayload)
		const documentHashEntries = HashEntriesFactory.fromPayload(documentObject.documentHashEntriesPayload)
		const documentMetadataPayload = documentObject.documentMetadataPayload

		let documentFile = null
		if (documentHashEntries.resemblesAPdf) {
			documentFile = new PdfFile(
				root,
				documentRootHashEntry,
				documentHashEntries,
				documentMetadataPayload
			)
		} else if (documentHashEntries.resemblesAnEpub) {
			documentFile = new EpubFile(
				root,
				documentRootHashEntry,
				documentHashEntries,
				documentMetadataPayload
			)
		} else {
			throw new Error('Unsupported document type')
		}

		return new Document(documentFile)
	}

	/**
	 * PDF or EPUB document from the reMarkable cloud API.
	 *
	 * @type {PdfFile | EpubFile}
	 */
	#apiDocument

	constructor(apiDocument) {
		this.#apiDocument = apiDocument
	}

	get apiDocument() {
		return this.#apiDocument
	}

	/**
	 * Serializes document to JSON format.
	 *
	 * @returns {String}
	 */
	get toJson() {
		return JSON.stringify(
			{
				documentRootHashEntryPayload: this.#apiDocument.rootHashEntry.payload,
				documentHashEntriesPayload: this.#apiDocument.hashEntries.payload,
				documentMetadataPayload: this.#apiDocument.metadata.payload
			}
		)
	}
}
