import {fromByteArray} from 'base64-js'
import {TextEncoder} from '@polkadot/x-textencoder'
import {CONFIGURATION} from '../../../configuration'
import Root from '../../sync/root'
import FileFactory from '../../sync/fileFactory'
import {HashEntriesFactory} from '../../schemas/index'
import FetchBasedHttpClient from '../../../../utils/httpClient/fetchBasedHttpClient'

export const REMARKABLE_UPLOAD_SOURCE = 'RoR-Browser'

export class UploadError extends Error {
	constructor(error) {
		super()
		this.message = `Failed to upload file: ${error.message}`
		this.name = 'UploadError'
	}
}

/**
 * Class representing a reMarkable file upload.
 *
 * This class uses the legacy v2 API of the
 * reMarkable cloud to upload files. This API
 * is still used by the official web browser
 * extension and simplifies the upload process
 * by allowing us to upload files directly
 * without needing to create a document first.
 */
export default class Upload {
	/**
	 * Uploads a file to the reMarkable cloud.
	 *
	 * @param {string} fileName - The name of the file to upload.
	 * @param {Buffer} fileBuffer - The buffer containing the file content.
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<HashEntry>} - Hash entry representing the uploaded file.
	 */
	static async upload(fileName, fileBuffer, session){
		try {
			const uploadResponse = await FetchBasedHttpClient.post(
				CONFIGURATION.endpoints.doc.v2.endpoints.files,
				fileBuffer.buffer,
				{
					Authorization: `Bearer ${session.token}`,
					'content-type': fileBuffer.mimeType,
					'rm-meta': this.#encodedName(fileName),
					'rm-source': REMARKABLE_UPLOAD_SOURCE
				}
			)

			const uploadResponseJson = await uploadResponse.json()

			const root = await Root.fromSession(session)
			const uploadedFileRootHashEntry = root.hashEntries.hashEntriesList.find(entry => entry.checksum === uploadResponseJson.hash)
			const uploadedFileHashEntriesPayload = await uploadedFileRootHashEntry.content(session)
			const uploadedFileHashEntries = HashEntriesFactory.fromPayload(uploadedFileHashEntriesPayload)

			return FileFactory.fileFromHashEntries(root, uploadedFileRootHashEntry, uploadedFileHashEntries, session)
		} catch (error) {
			throw new UploadError(error)
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
