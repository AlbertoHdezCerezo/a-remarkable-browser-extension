import * as Abstracts from '../abstracts'

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
}
