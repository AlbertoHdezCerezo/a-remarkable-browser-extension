import * as Abstracts from '../abstracts'

/**
 * Represents a reMarkable cloud API PDF file metadata.
 *
 * The PDF file metadata is a JSON which contains certain
 * information about the PDF file document.
 *
 * Example:
 *
 * ```
 * {
 *     "createdTime": "0",
 *     "lastModified": "1702268352386",
 *     "lastOpened": "1702267131426",
 *     "lastOpenedPage": 206,
 *     "parent": "81213c35-e5a9-4b39-9813-452ccb394dcd",
 *     "pinned": false,
 *     "type": "DocumentType",
 *     "visibleName": "A PDF Document.pdf"
 * }
 * ```
 *
 * This class acts as a wrapper of the JSON metadata,
 * providing additional methods, apart from the ones
 * to access the metadata attributes; to persist
 * changes back to the reMarkable cloud API.
 */
export class Metadata extends Abstracts.Metadata {
	/**
	 * Returns document name
	 *
	 * @returns {String}
	 */
	get documentName() {
		return this.#payload.visibleName
	}

	/**
	 * Returns the ID of the folder containing the document.
	 * If the returned value is `""` (blank string), it means
	 * the document is in the root folder.
	 *
	 * @returns {String}
	 */
	get folderId() {
		return this.#payload.parent
	}
}