import {FetchBasedHttpClient} from '../utils/httpClient/index.js'

export class Download {
	/**
	 * Download URL.
	 *
	 * @type {string}
	 */
	#url

	/**
	 * Name of the file to be downloaded.
	 *
	 * @type {string}
	 */
	#name

	/**
	 * Time the download was initiated.
	 *
	 * @type {Date}
	 */
	#downloadedAt

	/**
	 * reMarkable file ID attached to download.
	 *
	 * @type {string}
	 */
	#fileId

	constructor(url, name, fileId, downloadedAt = new Date()) {
		this.#url = url
		this.#name = name
		this.#fileId = fileId
		this.#downloadedAt = downloadedAt
	}

	/**
	 * Returns the download URL.
	 *
	 * @returns {string}
	 */
	get url() {
		return this.#url
	}

	/**
	 * Returns the name of the file to be downloaded.
	 *
	 * @returns {string}
	 */
	get name() {
		return this.#name
	}

	/**
	 * Returns the reMarkable file ID attached to the download.
	 *
	 * @returns {string}
	 */
	get fileId() {
		return this.#fileId
	}

	/**
	 * Returns the time the download was initiated.
	 *
	 * @returns {Date}
	 */
	get downloadedAt() {
		return this.#downloadedAt
	}

	/**
	 * Returns a serialized version of the Download instance.
	 * This serialized version is a JSON string containing
	 * all the information needed to reconstruct a Download instance.
	 *
	 * @returns {String}
	 */
	serialize() {
		return JSON.stringify(
			{
				url: this.url,
				name: this.name,
				fileId: this.fileId,
				downloadedAt: this.downloadedAt.toISOString()
			}
		)
	}

	/**
	 * Given a serialized download, returns an instance of the Download class.
	 *
	 * @param {String} stringifiedDownload - The serialized download.
	 * @returns {Download}
	 */
	static deserialize(stringifiedDownload) {
		const parsedDownload = JSON.parse(stringifiedDownload)

		return new Download(
			parsedDownload.url,
			parsedDownload.name,
			parsedDownload.fileId,
			new Date(parsedDownload.downloadedAt)
		)
	}

	/**
	 * Fetches the size of the file to be downloaded in bytes.
	 *
	 * @returns {Promise<number>} - Size of the file in bytes.
	 */
	async sizeInBytes() {
		const response = await FetchBasedHttpClient.get(this.#url, { method: 'HEAD' })
		const responseContentLength = response.headers.get('content-length')
		return responseContentLength ? parseInt(responseContentLength, 10) : 0
	}

	/**
	 * Fetches the file to be downloaded and returns it as a Buffer.
	 *
	 * @returns {Promise<Buffer<ImplicitArrayBuffer<ArrayBuffer>>>}
	 */
	async buffer() {
		const response = await FetchBasedHttpClient.get(this.#url)
		const arrayBuffer = await response.arrayBuffer()
		return Buffer.from(arrayBuffer)
	}
}