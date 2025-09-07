import * as Abstracts from '../abstracts'
import * as Schemas from '../../../schemas'

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
		return this.payload.visibleName
	}

	/**
	 * Returns the ID of the folder containing the document.
	 * If the returned value is `""` (blank string), it means
	 * the document is in the root folder.
	 *
	 * @returns {String}
	 */
	get folderId() {
		return this.payload.parent
	}

	/**
	 * Given a serialized file metadata,
	 * returns an instance of the File Metadata class.
	 *
	 * @param {String} stringifiedFileMetadata
	 * @returns {Metadata}
	 */
	static deserialize(stringifiedFileMetadata) {
		const parsedDocumentMetadata = JSON.parse(stringifiedFileMetadata)

		const rootHashEntry = Schemas.HashEntryFactory.fromPayload(parsedDocumentMetadata.rootHashEntry)
		const payload = parsedDocumentMetadata.payload

		return new this(rootHashEntry, payload)
	}

	/**
	 * Returns a serialized version of the File Metadata instance.
	 * This serialized version is a JSON string containing
	 * all the information needed to reconstruct the File instance.
	 *
	 * @returns {String}
	 */
	serialize() {
		return JSON.stringify(
			{
				rootHashEntry: this.rootHashEntry.payload,
				payload: this.payload
			}
		)
	}
}