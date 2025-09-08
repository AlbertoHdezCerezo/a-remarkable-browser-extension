import * as Abstracts from '../abstracts'
import * as Schemas from '../../../schemas'

/**
 * Represents a reMarkable cloud API folder metadata.
 *
 * The folder metadata is a JSON which contains certain
 * information about a reMarkable APIfolder.
 *
 * Example:
 *
 * ```
 * {
 *     "createdTime": "1733944931405",
 *     "lastModified": "1733944931404",
 *     "parent": "5100ea0c-cec8-4d2e-9833-d179ddfff95d",
 *     "pinned": false,
 *     "type": "CollectionType",
 *     "visibleName": "A folder name"
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
	 * Returns folder name
	 *
	 * @returns {String}
	 */
	get folderName() {
		return this.payload.visibleName
	}

	/**
	 * Returns the ID of the folder containing the folder.
	 * If the returned value is `""` (blank string), it
	 * means the folder is in the root folder.
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
