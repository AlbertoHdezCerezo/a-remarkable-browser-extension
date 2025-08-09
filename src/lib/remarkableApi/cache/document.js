export default class Document {
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
}
