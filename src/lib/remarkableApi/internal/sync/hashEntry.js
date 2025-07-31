import {CONFIGURATION} from '../../configuration'
import FetchBasedHttpClient from '../../../utils/httpClient/fetchBasedHttpClient'

export default class HashEntry {
	/**
	 * Hash entry payload. Returned by the reMarkable API
	 * when fetching a file's hash entries. Each entry represents
	 * a sub-file or a part of the file.
	 */
	#payload

	/**
	 * Sub-file hash
	 * @typedef {string}
	 */
	#hash

	/**
	 * Number of sub-hash entries within file represented by hash entry
	 * @type {number}
	 */
	#nestedHashEntriesCount

	/**
	 * Size of the file in bytes.
	 * @type {number}
	 */
	#sizeInBytes

	/**
	 * Unique UUID identifier for the file.
	 * @type {string}
	 */
	#fileId

	/**
	 * File extension associated with the hash entry.
	 * @type {string}
 	 */
	#fileExtension

	constructor(hashEntryPayload) {
		this.#payload = hashEntryPayload

		const [hash, _zero, subFileHash, nestedHashEntriesCount, sizeInBytes] = hashEntryPayload.split(':')

		const [fileId, fileExtension] = subFileHash.split('.')

		this.#hash = hash
		this.#nestedHashEntriesCount = Number(nestedHashEntriesCount)
		this.#sizeInBytes = Number(sizeInBytes)
		this.#fileId = fileId
		this.#fileExtension = fileExtension
	}

	/**
	 * Returns the hash entry payload.
	 * @returns {string}
	 */
	get payload() {
		return this.#payload
	}

	/**
	 * Returns the hash of the sub-file.
	 * @returns {string}
	 */
	get hash() {
		return this.#hash
	}

	/**
	 * Returns the number of sub-hash entries within the file represented by this hash entry.
	 * @returns {number}
	 */
	get nestedHashEntriesCount() {
		return this.#nestedHashEntriesCount
	}

	/**
	 * Returns the size of the file in bytes.
	 * @returns {number}
	 */
	get sizeInBytes() {
		return this.#sizeInBytes
	}

	/**
	 * Returns the unique UUID identifier for the file.
	 * @returns {string}
	 */
	get fileId() {
		return this.#fileId
	}

	/**
	 * Returns the file extension associated with the hash entry.
	 * @returns {string | null}
	 */
	get fileExtension() {
		return this.#fileExtension
	}

	/**
	 * Returns true if the hash entry is a root entry, meaning it has no file extension.
	 * @returns {boolean}
	 */
	get rootHashEntry() {
		return this.fileExtension === null || this.fileExtension === undefined
	}

	/**
	 * Returns the URL to fetch the content of the file represented by this hash entry.
	 * @returns {string}
	 */
	get url() {
		return CONFIGURATION.endpoints.sync.v3.endpoints.files + this.hash
	}

	/**
	 * Fetches the content of the file represented by this hash entry.
	 * @param {Session} session - The session object containing the authentication token.
	 * @returns {Promise<object|string>}
	 */
	async content(session) {
		const contentResponse =
			await FetchBasedHttpClient
				.get(this.url, {'Authorization': `Bearer ${session.token}`})

		const contentRawPayload = await contentResponse.text()

		/**
		 * A response can either contain a plain text resembling
		 * a set of hash entries, or a JSON. Hence, we try to parse
		 * the response as JSON, and if it fails, we return the raw payload.
 		 */
		try {
			return JSON.parse(contentRawPayload)
		} catch (error) {
			return contentRawPayload
		}
	}
}