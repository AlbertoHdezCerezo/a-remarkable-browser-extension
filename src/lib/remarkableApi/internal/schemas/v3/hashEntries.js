import {HashEntry} from './hashEntry'
import RequestBuffer from '../../sync/v3/utils/requestBuffer'

export class MissingHashEntryForReplacementError extends Error {
	constructor() {
		super(`
			Attempt to replace a hash entry that does not exist in the hash entries.
			Ensure the hash entry you are trying to replace is present in the hash entries.
		`)
		this.name = 'MissingHashEntryForReplacementError'
	}
}

export class IncompatibleSchemaVersionError extends Error {
	constructor(schemaVersion) {
		super(`
			Hash Entries payload schema version mismatches
			the expected version. Expected: 3, got: ${schemaVersion}.
		`)
		this.name = 'IncompatibleSchemaVersionError'
	}
}

export class IncompatibleHashEntriesSchemaError extends Error {
	constructor(
		hashEntriesPayload,
		message = `
			Hash entries payload is incompatible with the Hash Entries v4 schema.
			Expected payload to be a string with the following format:
			<schemaVersion>
			<hashEntry1>
			<hashEntry2>
			...
			Received payload: ${hashEntriesPayload}
		`
	) {
		super(message)
		this.name = 'IncompatibleHashEntriesSchemaError'
	}
}

/**
 * Represents a reMarkable cloud API hash entries.
 *
 * A hash entries is a multi-line string containing
 * a set of hash entries, plus some additional metadata.
 *
 * Example:
 *
 * ```
 * 3
 * cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531
 * cf0603f27e347959822926d78430c77e4264f014a9c816fe33029befb4a80f12:0:008302bc-c5ba-41be-925b-8567166246e4.epub:0:2583509
 * 69ae298325a1a1d3f2dc4f6d6daa1db9b52ac523a1c455f19de4348184ce53e6:0:008302bc-c5ba-41be-925b-8567166246e4.metadata:0:327
 * ...
 * ```
 *
 * - Hash entries schema version: schema version of the hash entries payload
 * - Hash entries: list of hash entries representing the content behind the file
 */
export class HashEntries {
	/**
	 * Payload of the hash entries.
	 *
	 * Example:
	 * ```
	 * 3
	 * cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531
	 * cf0603f27e347959822926d78430c77e4264f014a9c816fe33029befb4a80f12:0:008302bc-c5ba-41be-925b-8567166246e4.epub:0:2583509
	 * ...
	 * ```
	 *
	 * @typedef {string}
	 */
	#payload

	/**
	 * List of hash entries representing the
	 * file associated to these entries.
	 *
	 * @typedef {Array<HashEntry>}
	 */
	#hashEntriesList

	/**
	 * Schema version of the hash entries payload.
	 *
	 * @type {number}
 	 */
	#schemaVersion

	constructor(hashEntriesPayload) {
		this.#payload = hashEntriesPayload

		const hashEntriesLines =
			hashEntriesPayload
				.split('\n')
				.filter((line) => line.trim() !== '')

		const [
			schemaVersionString,
			...fileNestedHashEntriesStrings
		] = hashEntriesLines

		if (schemaVersionString !== '3') throw new IncompatibleSchemaVersionError()

		this.#schemaVersion = Number(schemaVersionString)

		if (fileNestedHashEntriesStrings.length === 0) {
			throw new IncompatibleHashEntriesSchemaError(hashEntriesPayload)
		}

		this.#hashEntriesList = fileNestedHashEntriesStrings.map((line) => new HashEntry(line))
	}

	/**
	 * Returns the hash entries payload.
	 *
	 * @returns {string}
	 */
	get payload() {
		return this.#payload
	}

	/**
	 * Returns the list of the file nested hash entries.
	 *
	 * @returns {Array<HashEntry>}
	 */
	get hashEntriesList() {
		return this.#hashEntriesList
	}

	/**
	 * Returns the schema version of the hash entries.
	 *
	 * @returns {number}
	 */
	get schemaVersion() {
		return this.#schemaVersion
	}

	/**
	 * Returns the number of nested hash entries in the file hash entries.
	 *
	 * @returns {number}
	 */
	get nestedHashEntriesCount() {
		return this.hashEntriesList.length
	}

	/**
	 * Returns the unique UUID identifier for the file associated with this hash entries.
	 *
	 * @returns {string}
	 */
	get fileId() {
		const hashEntry = this.hashEntriesList[0]
		return hashEntry.fileId
	}

	/**
	 * Returns the size of the file in bytes.
	 *
	 * @returns {number}
	 */
	get sizeInBytes() {
		return this.sizeInBytesFromHashEntries
	}

	/**
	 * Returns true if the hash entries represents
	 * the reMarkable cloud hash entries.
	 *
	 * @returns {boolean}
	 */
	get rootHashEntries() {
		return !this.hashEntriesList.some((entry) => entry.fileExtension !== undefined)
	}

	/**
	 * Returns true if the hash entries resemble a folder.
	 *
	 * @returns {boolean}
	 */
	get resemblesAFolder() {
		return !this.#hashEntriesList.some((entry) => entry.fileExtension === 'pagedata')
	}

	/**
	 * Returns true if the hash entries resemble a PDF file.
	 *
	 * @returns {boolean}
	 */
	get resemblesAPdf() {
		return this.#hashEntriesList.some((entry) => entry.fileExtension === 'pdf') &&
			!this.#hashEntriesList.some((entry) => entry.fileExtension === 'epub')
	}

	/**
	 * Returns true if the hash entries resemble an EPUB file.
	 *
	 * @returns {boolean}
	 */
	get resemblesAnEpub() {
		return this.#hashEntriesList.some((entry) => entry.fileExtension === 'epub')
	}

	/**
	 * Returns the total size in bytes of all hash entries,
	 * based on their individual sizes, instead of relying
	 * on the hash entry used to load the hash entries.
	 *
	 * @returns {number}
	 */
	get sizeInBytesFromHashEntries() {
		return this.hashEntriesList.reduce((total, hashEntry) => {
			return total + hashEntry.sizeInBytes
		}, 0)
	}

	/**
	 * Returns a new instance of HashEntries where a given
	 * hash entry is replaced with a new hash entry. If
	 * the current hash entry is not found,
	 *
	 * @param {HashEntry} hashEntryToReplace - The hash entry to replace.
	 * @param {HashEntry} newHashEntry - The new hash entry to replace the current one.
	 * @returns {HashEntries} - A new instance of HashEntries with the replaced hash entry.
	 */
	replace(hashEntryToReplace, newHashEntry) {
		const index = this.hashEntriesList.findIndex(entry => entry.checksum === hashEntryToReplace.checksum)

		if (index === -1) throw new MissingHashEntryForReplacementError()

		let newHashEntriesPayload = this.payload
			.replace(hashEntryToReplace.payload, newHashEntry.payload)

		return new HashEntries(newHashEntriesPayload)
	}

	/**
	 * Returns a new RequestBuffer instance
	 * containing the hash entries payload.
	 *
	 * @returns {RequestBuffer}
	 */
	asRequestBuffer() {
		return new RequestBuffer(this.payload)
	}

	/**
	 * Generates a checksum of the hash entries payload.
	 *
	 * @returns {Promise<String>}
	 */
	async checksum() {
		return this.asRequestBuffer().checksum()
	}
}