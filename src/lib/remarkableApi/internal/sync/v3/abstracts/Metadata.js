import {CONFIGURATION} from '../../../../configuration'
import {FetchBasedHttpClient} from '../../../../../utils/httpClient'
import {RequestBuffer} from '../utils'
import * as Schemas from '../../../schemas'

/**
 * Abstract class representing a file
 * or folder in the Remarkable API.
 *
 * Abstracts the logic for handling
 * documents and folders across
 * the Remarkable API data models.
 */
export class Metadata {
	/**
	 * The file root hash entry the metadata belongs to.
	 *
	 * @type {HashEntry}
	 */
	#rootHashEntry

	/**
	 * The file metadata payload. Represents the
	 * content of the `.metadata` file hash entry.
	 *
	 * @type {Object}
	 */
	#payload

	constructor(rootHashEntry, metadataPayload) {
		this.#rootHashEntry = rootHashEntry
		this.#payload = metadataPayload
	}

	/**
	 * Returns the folder root hash entry.
	 *
	 * @returns {HashEntry}
	 */
	get rootHashEntry() {
		return this.#rootHashEntry
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
	 * Updates the file metadata via the reMarkable API.
	 * Returns a new hash entry representing the updated
	 * metadata entry.
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
			'rm-filename': `${this.rootHashEntry.fileId}.metadata`,
			'rm-parent-hash': this.rootHashEntry.checksum,
			'x-goog-hash': `crc32c=${updateRequestBuffer.crc32Hash}`,
		}

		const newMetadataChecksum = await updateRequestBuffer.checksum()

		await FetchBasedHttpClient.put(
			CONFIGURATION.endpoints.sync.v3.endpoints.files + newMetadataChecksum,
			updateRequestBuffer.payload,
			updateRequestHeaders,
		)

		return Schemas.HashEntryFactory.fromPayload(`${newMetadataChecksum}:0:${this.rootHashEntry.fileId}.metadata:0:${updateRequestBuffer.sizeInBytes}`)
	}
}