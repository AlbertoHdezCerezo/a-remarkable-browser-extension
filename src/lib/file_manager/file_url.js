/**
 * Represents the URL to download a file from the reMarkable
 * device via its `Storage` API.
 *
 * For more information, see:
 * https://github.com/splitbrain/ReMarkableAPI/wiki/Storage
 *
 * @class
 */
export default class FileUrl {
	/**
	 * URL to download the file from the reMarkable
	 * device via its `Storage` API.
	 *
	 * @private
	 */
	#url

	/**
	 * URL expiration date. Once reached, the
	 * file will no longer be downloadable
	 * from the associated URL.
	 *
	 * @private
	 */
	#expiration

	/**
	 * Given a Hash representing a remarkable API
	 * file payload, creates a new instance of FileUrl.
	 */
	static fromRemarkableFileHash(remarkableFileHash) {
		return new FileUrl(
			remarkableFileHash.url,
			remarkableFileHash.expiration
		)
	}

	/**
	 * Creates a new instance of FileUrl.
	 *
	 * @constructor
	 * @param {string} url - remarkable API URL to download a file
	 * @param {Date} expiration - date when the URL expires
	 */
	constructor(url, expiration) {
		this.#url = url
		this.#expiration = new Date(expiration)
	}

	get url() { return this.#url }

	get expiration() { return this.#expiration }

	get expired() { return this.#expiration < new Date() }
}
