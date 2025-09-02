import {CONFIGURATION} from '../../../../../configuration'
import {RequestBuffer} from '../../utils'
import * as Schemas from '../../../../schemas'
import {FetchBasedHttpClient} from '../../../../../../utils/httpClient'

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
export class PdfMetadata {
	/**
	 * The PDF file root hash entry the metadata belongs to.
	 *
	 * @type {HashEntry}
	 */
	#pdfFileRootHashEntry

	/**
	 * The PDF File metadata payload. Represents the
	 * content of the `.metadata` PDF file hash entry.
	 *
	 * @type {Object}
	 */
	#payload

	constructor(pdfFileRootHashEntry, metadataPayload) {
		this.#pdfFileRootHashEntry = pdfFileRootHashEntry
		this.#payload = metadataPayload
	}

	/**
	 * Returns the PDF file root hash entry.
	 *
	 * @returns {HashEntry}
	 */
	get pdfFileHashEntry() {
		return this.#pdfFileRootHashEntry
	}

	/**
	 * Returns the metadata payload of the PDF file.
	 *
	 * @returns {Object}
	 */
	get payload() {
		return this.#payload
	}

	/**
	 * Returns PDF file name
	 *
	 * @returns {String}
	 */
	get fileName() {
		return this.#payload.visibleName
	}

	/**
	 * Returns the ID of the folder containing the PDF file.
	 * If the returned value is `""` (blank string), it means
	 * the PDF file is in the root folder.
	 *
	 * @returns {String}
	 */
	get folderId() {
		return this.#payload.parent
	}

	/**
	 * Updates the PDF file metadata via the reMarkable API.
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
			'rm-filename': `${this.pdfFileHashEntry.fileId}.metadata`,
			'rm-parent-hash': this.pdfFileHashEntry.checksum,
			'x-goog-hash': `crc32c=${updateRequestBuffer.crc32Hash}`,
		}

		const newPdfMetadataChecksum = await updateRequestBuffer.checksum()

		await FetchBasedHttpClient.put(
			CONFIGURATION.endpoints.sync.v3.endpoints.files + newPdfMetadataChecksum,
			updateRequestBuffer.payload,
			updateRequestHeaders,
		)

		return new Schemas.V4.HashEntry(`${newPdfMetadataChecksum}:0:${this.pdfFileHashEntry.fileId}.metadata:0:${updateRequestBuffer.sizeInBytes}`)
	}
}