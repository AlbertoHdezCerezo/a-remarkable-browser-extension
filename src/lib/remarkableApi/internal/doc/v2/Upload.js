import {fromByteArray} from 'base64-js'
import {TextEncoder} from '@polkadot/x-textencoder'
import {CONFIGURATION} from '../../../configuration'
import * as Sync from '../../sync'
import * as Schemas from '../../schemas'
import {FetchBasedHttpClient} from '../../../../utils/httpClient'

export const REMARKABLE_UPLOAD_SOURCE = 'RoR-Browser'

export class UploadError extends Error {
	constructor(error) {
		super()
		this.message = `Failed to upload file: ${error.message}`
		this.name = 'UploadError'
		this.stack = error.stack
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
export class Upload {
	/**
	 * Creates a new folder in the reMarkable cloud.
	 *
	 * @param {string} folderName - The name of the folder to create.
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<Folder>}
	 */
	static async folder(folderName, session) {
		return await this.#upload(folderName, null, session)
	}

	/**
	 *
	 * @param {string} documentName - The name of the document to upload.
	 * @param {Buffer} documentBuffer - The buffer containing the document content.
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<PdfFile|EpubFile>}
	 */
	static async document(documentName, documentBuffer, session) {
		return await this.#upload(documentName, documentBuffer, session)
	}

	/**
	 * Uploads a file to the reMarkable cloud.
	 *
	 * @param {string} fileName - The name of the file to upload.
	 * @param {Buffer | Null} fileBuffer - The buffer containing the file content.
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<PdfFile | EpubFile | Folder>} - Hash entry representing the uploaded file.
	 */
	static async #upload(fileName, fileBuffer, session){
		try {
			const uploadResponse = await FetchBasedHttpClient.post(
				CONFIGURATION.endpoints.doc.v2.endpoints.files,
				fileBuffer?.buffer,
				{
					Authorization: `Bearer ${session.token}`,
					'content-type': fileBuffer?.mimeType || 'folder',
					'rm-meta': this.#encodedName(fileName),
					'rm-source': REMARKABLE_UPLOAD_SOURCE
				}
			)

			const uploadResponseJson = await uploadResponse.json()

			const root = await Sync.Root.fromSession(session)
			const uploadedFileRootHashEntry = root.hashEntries.hashEntriesList.find(entry => entry.checksum === uploadResponseJson.hash)
			const uploadedFileHashEntriesPayload = await uploadedFileRootHashEntry.content(session)
			const uploadedFileHashEntries = Schemas.HashEntriesFactory.fromPayload(uploadedFileHashEntriesPayload)

			return await Sync.FileFactory.fileFromHashEntries(root, uploadedFileRootHashEntry, uploadedFileHashEntries, session)
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
