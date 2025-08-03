import {CONFIGURATION} from '../../../../../configuration'
import RequestBuffer from '../../utils/requestBuffer'
import {V4HashEntry} from '../../../../schemas/index'
import FetchBasedHttpClient from '../../../../../../utils/httpClient/fetchBasedHttpClient'

/**
 * Represents a reMarkable cloud API ePub file metadata.
 *
 * The PDF file metadata is a JSON which contains certain
 * information about the ePub file document.
 *
 * Example:
 *
 * ```
 * {
 *     "createdTime": "1738999062399",
 *     "lastModified": "1739390477710",
 *     "lastOpened": "1739390402818",
 *     "lastOpenedPage": 5,
 *     "new": false,
 *     "parent": "4c6b5473-f424-4f18-88b3-e94051b7457b",
 *     "pinned": false,
 *     "source": "",
 *     "type": "DocumentType",
 *     "visibleName": "An ePub Document.epub"
 * }
 * ```
 *
 * This class acts as a wrapper of the JSON metadata,
 * providing additional methods, apart from the ones
 * to access the metadata attributes; to persist
 * changes back to the reMarkable cloud API.
 */
export default class EpubMetadata {
	/**
	 * The ePub file root hash entry the metadata belongs to.
	 *
	 * @type {HashEntry}
	 */
	#epubFileRootHashEntry

	/**
	 * The PDF File metadata payload. Represents the
	 * content of the `.metadata` PDF file hash entry.
	 *
	 * @type {Object}
	 */
	#payload

	constructor(epubFileRootHashEntry, metadataPayload) {
		this.#epubFileRootHashEntry = epubFileRootHashEntry
		this.#payload = metadataPayload
	}

	/**
	 * Returns the ePub file root hash entry.
	 *
	 * @returns {HashEntry}
	 */
	get epubFileRootHashEntry() {
		return this.#epubFileRootHashEntry
	}

	/**
	 * Returns the metadata payload of the ePub file.
	 *
	 * @returns {Object}
	 */
	get payload() {
		return this.#payload
	}

	/**
	 * Returns ePub file name
	 *
	 * @returns {String}
	 */
	get fileName() {
		return this.#payload.visibleName
	}

	/**
	 * Returns the ID of the folder containing the ePub file.
	 * If the returned value is `""` (blank string), it means
	 * the PDF file is in the root folder.
	 *
	 * @returns {String}
	 */
	get folderId() {
		return this.#payload.parent
	}

	/**
	 * Updates the ePub file metadata via the reMarkable API.
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
			'rm-filename': `${this.epubFileRootHashEntry.fileId}.metadata`,
			'rm-parent-hash': this.epubFileRootHashEntry.checksum,
			'x-goog-hash': `crc32c=${updateRequestBuffer.crc32Hash}`,
		}

		const newEpubMetadataChecksum = await updateRequestBuffer.checksum()

		await FetchBasedHttpClient.put(
			CONFIGURATION.endpoints.sync.v3.endpoints.files + newEpubMetadataChecksum,
			updateRequestBuffer.payload,
			updateRequestHeaders,
		)

		return new V4HashEntry(`${newEpubMetadataChecksum}:0:${this.epubFileRootHashEntry.fileId}.metadata:0:${updateRequestBuffer.sizeInBytes}`)
	}
}