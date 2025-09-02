import {CONFIGURATION} from '../../../../../configuration'
import {FetchBasedHttpClient} from '../../../../../../utils/httpClient'
import {HashEntryFactory} from '../../../../schemas'
import {RequestBuffer} from '../../utils'

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
export class FolderMetadata {
	/**
	 * The folder root hash entry the metadata belongs to.
	 *
	 * @type {HashEntry}
	 */
	#folderRootHashEntry

	/**
	 * The folder metadata payload. Represents the
	 * content of the `.metadata` folder hash entry.
	 *
	 * @type {Object}
	 */
	#payload

	constructor(folderRootHashEntry, metadataPayload) {
		this.#folderRootHashEntry = folderRootHashEntry
		this.#payload = metadataPayload
	}

	/**
	 * Returns the folder root hash entry.
	 *
	 * @returns {HashEntry}
	 */
	get folderRootHashEntry() {
		return this.#folderRootHashEntry
	}

	/**
	 * Returns the metadata payload of the folder.
	 *
	 * @returns {Object}
	 */
	get payload() {
		return this.#payload
	}

	/**
	 * Returns folder name
	 *
	 * @returns {String}
	 */
	get folderName() {
		return this.#payload.visibleName
	}

	/**
	 * Returns the ID of the folder containing the folder.
	 * If the returned value is `""` (blank string), it
	 * means the folder is in the root folder.
	 *
	 * @returns {String}
	 */
	get folderId() {
		return this.#payload.parent
	}

	/**
	 * Updates the folder metadata via the reMarkable API.
	 * Returns a new hash entry representing the updated metadata entry.
	 *
	 * @param {Object} updatedMetadataPayload - The updated metadata payload
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<HashEntry>}
	 */
	async update(updatedMetadataPayload, session) {
		const updateRequestBuffer =
			new RequestBuffer(JSON.stringify({...this.#payload, ...updatedMetadataPayload}))

		const updateRequestHeaders = {
			'authorization': `Bearer ${session.token}`,
			'content-type': 'application/octet-stream',
			'rm-filename': `${this.folderRootHashEntry.fileId}.metadata`,
			'rm-parent-hash': this.folderRootHashEntry.checksum,
			'x-goog-hash': `crc32c=${updateRequestBuffer.crc32Hash}`,
		}

		const newFolderMetadataChecksum = await updateRequestBuffer.checksum()

		await FetchBasedHttpClient.put(
			CONFIGURATION.endpoints.sync.v3.endpoints.files + newFolderMetadataChecksum,
			updateRequestBuffer.payload,
			updateRequestHeaders,
		)

		return new HashEntryFactory.fromPayload(`${newFolderMetadataChecksum}:0:${this.folderRootHashEntry.fileId}.metadata:0:${updateRequestBuffer.sizeInBytes}`)
	}
}