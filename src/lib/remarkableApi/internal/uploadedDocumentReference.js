/**
 * reMarkable API response payload from
 * a successful file upload through the
 * internal API endpoint.
 */
export default class UploadedDocumentReference {
	/**
	 * The unique identifier of the uploaded document.
	 * @type {string}
	 */
	#id

	/**
	 * HashUrl of the uploaded document.
	 * @type {string}
	 */
	#hash

	/**
	 * Given a response from the internal endpoint for
	 * uploading files, parses the response payload
	 * and returns in an object representing the
	 * uploaded document reference.
	 *
	 * @param {Response} response - The response from the internal API after a file upload.
	 * @returns {Promise<UploadedDocumentReference>}
	 */
	static async fromInternalApiResponse(response) {
		const responsePayload = JSON.parse(await response.text())

		return new UploadedDocumentReference(responsePayload.id, responsePayload.hash)
	}

	constructor(id, hash) {
		this.#id = id
		this.#hash = hash
	}

	/**
	 * Returns the unique identifier of the uploaded document.
	 *
	 * @returns {string}
	 */
	get id() {
		return this.#id
	}

	/**
	 * Returns the hash URL of the uploaded document.
	 *
	 * @returns {string}
	 */
	get hash() {
		return this.#hash
	}
}