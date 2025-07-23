import { TextEncoder } from '@polkadot/x-textencoder'
import { fromByteArray } from 'base64-js'
import UploadedDocumentReference from './uploadedDocumentReference'
import FetchBasedHttpClient from '../../utils/httpClient/fetchBasedHttpClient'

export const REMARKABLE_UPLOAD_SOURCE = 'RoR-Browser'

export class UploadError extends Error {}

/**
 * Handles remarkable API file upload through the
 * official reMarkable API extension endpoint used
 * for uploading files to the device.
 *
 * This endpoint is not implemented as a service,
 * as the other reMarkable API endpoints, such as
 * the `storage` or the `notification` services
 * used by the classes under the `service` namespace.
 */
export default class Uploader {
	/**
	 * Uploads a file to the reMarkable cloud.
	 *
	 * @param {string} fileName - The name of the file to upload.
	 * @param {Buffer} fileBuffer - The buffer containing the file content.
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<UploadedDocumentReference>} - A promise that resolves to an UploadedDocumentReference object.
	 */
	static async upload(fileName, fileBuffer, session){
		try {
			const uploadResponse = await FetchBasedHttpClient.post(
				`https://internal.cloud.remarkable.com/doc/v2/files`,
				fileBuffer.buffer,
				{
					Authorization: `Bearer ${session.token}`,
					'content-type': fileBuffer.mimeType,
					'rm-meta': this.#encodedName(fileName),
					'rm-source': REMARKABLE_UPLOAD_SOURCE
				}
			)

			return await UploadedDocumentReference.fromInternalApiResponse(uploadResponse)
		} catch (error) {
			throw new UploadError(`Failed to upload file: ${error.message}`)
		}
	}

	/**
	 * Encodes the file name to be used in the `rm-meta` header
	 * of the file upload request.
	 *
	 * @param {string} fileName - The name of the file to encode.
	 * @returns {string}
	 */
	static #encodedName(fileName) {
		const encoder = new TextEncoder()
		const namePayload = JSON.stringify({ file_name: fileName })
		const encodedNamePayload = encoder.encode(namePayload)
		return fromByteArray(encodedNamePayload)
	}
}
