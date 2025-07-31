import {CONFIGURATION} from '../../../../../configuration'
import RequestBuffer from '../../utils/requestBuffer'
import FetchBasedHttpClient from '../../../../../../utils/httpClient/fetchBasedHttpClient'

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
	 * @returns {Promise<RequestBuffer>}
	 */
	async update(updatedMetadataPayload, session) {
		const metadataPayload = {
			...this.#payload,
			...updatedMetadataPayload
		}

		const metadataRequestBuffer = new RequestBuffer(metadataPayload)

		const updateRequestHeaders = {
			'authorization': `Bearer ${session.token}`,
			'content-type': 'application/octet-stream',
			'rm-filename': `${pdfFileHashEntry.fileId}.${pdfFileHashEntry.fileExtension}`,
			'rm-parent-hash': pdfFile.hash,
			'x-goog-hash': metadataRequestBuffer.crc32Hash,
		}

		const updateResponse = await FetchBasedHttpClient.put(
			CONFIGURATION.endpoints.sync.v3.endpoints.files + (await metadataRequestBuffer.hash()),
			metadataRequestBuffer.payload,
			updateRequestHeaders,
		)

		return metadataRequestBuffer
	}
}