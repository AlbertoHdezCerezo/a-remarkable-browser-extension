import HashEntry from './hashEntry'

export default class HashEntries {
	/**
	 * Hash entries payload. Is what the reMarkable API
	 * returns when fetching a file's hash entries.
	 * @typedef {string}
	 */
	#payload

	/**
	 * List of hash entries, parsed from each
	 * individual line in the hash entries payload.
	 * @typedef {Array<HashEntry>}
	 */
	#hashEntriesList

	/**
	 * Hash entry schema version present in the payload.
	 * @type {number}
 	 */
	#schemaVersion

	/**
	 * Number of nested hash entries within the file represented by the hash entries.
	 * @type {number}
	 */
	#nestedHashEntriesCount

	/**
	 * Unique UUID identifier for the file.
	 * @type {string}
	 */
	#fileId

	/**
	 * Size of the file in bytes.
	 * @type {number}
 	 */
	#sizeInBytes

	constructor(hashEntriesPayload) {
		this.#payload = hashEntriesPayload

		const hashEntriesLines =
			hashEntriesPayload
				.split('\n')
				.filter((line) => line.trim() !== '')

		const [
			schemaVersionString,
			fileDataString,
			...fileNestedHashEntriesStrings
		] = hashEntriesLines

		this.#schemaVersion = Number(schemaVersionString)

		const [_zero, fileId, nestedHashEntriesCount, sizeInBytes] = fileDataString.split(':')

		this.#fileId = fileId
		this.#nestedHashEntriesCount = Number(nestedHashEntriesCount)
		this.#sizeInBytes = Number(sizeInBytes)
		this.#hashEntriesList = fileNestedHashEntriesStrings.map((line) => new HashEntry(line))
	}

	/**
	 * Returns the hash entries payload.
	 * @returns {string}
	 */
	get payload() {
		return this.#payload
	}

	/**
	 * Returns the list of hash entries.
	 * @returns {Array<HashEntry>}
	 */
	get hashEntriesList() {
		return this.#hashEntriesList
	}

	/**
	 * Returns the schema version of the hash entries.
	 * @returns {number}
	 */
	get schemaVersion() {
		return this.#schemaVersion
	}

	/**
	 * Returns the type number of the file.
	 * @returns {number}
	 */
	get nestedHashEntriesCount() {
		return this.#nestedHashEntriesCount
	}

	/**
	 * Returns the unique file identifier.
	 * @returns {string}
	 */
	get fileId() {
		return this.#fileId
	}

	/**
	 * Returns the size of the file in bytes.
	 * @returns {number}
	 */
	get sizeInBytes() {
		return this.#sizeInBytes
	}

	/**
	 * Returns true if the hash entries represents a root hash file.
	 * @returns {boolean}
	 */
	get rootHashEntries() {
		return this.#fileId === '.'
	}

	/**
	 * Returns true if the hash entries resemble a folder.
	 * @returns {boolean}
	 */
	get resemblesAFolder() {
		return !this.#hashEntriesList.some((entry) => entry.fileExtension === 'pagedata')
	}

	/**
	 * Returns true if the hash entries resemble a PDF file.
	 * @returns {boolean}
	 */
	get resemblesAPdf() {
		return this.#hashEntriesList.some((entry) => entry.fileExtension === 'pdf') &&
			!this.#hashEntriesList.some((entry) => entry.fileExtension === 'epub')
	}

	/**
	 * Returns true if the hash entries resemble an EPUB file.
	 * @returns {boolean}
	 */
	get resemblesAnEpub() {
		return this.#hashEntriesList.some((entry) => entry.fileExtension === 'epub')
	}
}