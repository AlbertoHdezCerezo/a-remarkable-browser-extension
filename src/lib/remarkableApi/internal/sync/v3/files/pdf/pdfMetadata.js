import {CONFIGURATION} from '../../../../../configuration'
import FetchBasedHttpClient from '../../../../../../utils/httpClient/fetchBasedHttpClient'
import HashEntry from '../../../../schemas/v4/hashEntry'
import RequestBuffer from '../../utils/requestBuffer'

/**
 * Class representing the metadata of a PDF file.
 *
 * In the reMarkable API, this metadata is contained
 * within the `.pdf` hash entry of a `PDF` file. It
 * provides information such as the file name or its
 * parent folder ID. By updating the metadata of a
 * PDF file we can rename a file or move it to a
 * different folder.
 */
export default class PdfMetadata {
	/**
	 * The PDF file root hash entry the metadata belongs to.
	 *
	 * @type {HashEntry}
	 */
	#pdfFileRootHashEntry

	/**
	 * The metadata payload of the PDF file. Represents
	 * the content of the `.metadata` PDF file hash entry.
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
	 * It is used for performing update operations
	 * over the PDF file metadata (file renaming
	 * and moving between folders).
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
	 * Returns unique UUID of the folder containing the PDF file.
	 * If the returned value is `""` (blank string), it means
	 * the PDF file is in the root folder.
	 *
	 * @returns {*}
	 */
	get folderId() {
		return this.#payload.parent
	}

	/**
	 * Updates the PDF file metadata via the reMarkable API.
	 *
	 * @param {Object} updatedMetadataPayload - The updated metadata payload
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<HashEntry>}
	 */
	async update(updatedMetadataPayload, session) {
		const updateRequestBody = {
			...this.#payload,
			...updatedMetadataPayload
		}

		const updateRequestBuffer = new RequestBuffer(updateRequestBody)

		const updateRequestHeaders = {
			'authorization': `Bearer ${session.token}`,
			'content-type': 'application/octet-stream',
			'rm-filename': `${this.pdfFileHashEntry.fileId}.metadata`,
			'rm-parent-hash': this.pdfFileHashEntry.hash,
			'x-goog-hash': `crc32c=${updateRequestBuffer.crc32Hash}`,
		}

		const newPdfMetadataHash = await updateRequestBuffer.hash()

		await FetchBasedHttpClient.put(
			CONFIGURATION.endpoints.sync.v3.endpoints.files + newPdfMetadataHash,
			updateRequestBuffer.payload,
			updateRequestHeaders,
		)

		return new HashEntry(`${newPdfMetadataHash}:0:${this.pdfFileHashEntry.fileId}.metadata:0:${updateRequestBuffer.sizeInBytes}`)
	}
}