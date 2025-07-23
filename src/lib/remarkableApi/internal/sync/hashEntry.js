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
	 * File type associated with the hash entries.
	 * @type {number}
	 */
	#typeNumber

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

		const [hash, _zero, subFileHash, typeNumber, sizeInBytes] = hashEntryPayload.split(':')

		const [fileId, fileExtension] = subFileHash.split('.')

		this.#hash = hash
		this.#typeNumber = Number(typeNumber)
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
	 * Returns the file type number.
	 * @returns {number}
	 */
	get typeNumber() {
		return this.#typeNumber
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
}