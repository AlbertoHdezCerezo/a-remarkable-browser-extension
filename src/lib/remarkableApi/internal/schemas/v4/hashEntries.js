import {HashEntry} from './hashEntry'
import {HashEntries as AbstractHashEntries} from '../abstracts/hashEntries'
import {RequestBuffer} from '../../sync/v3/utils/requestBuffer'

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
			the expected version. Expected: 4, got: ${schemaVersion}.
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
			<zero>:<fileId>:<nestedHashEntriesCount>:<sizeInBytes>
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
 * A hash entries is a multi-line string contatining
 * a set of hash entries, plus some additional metadata.
 *
 * Example:
 *
 * 4
 * 0:008302bc-c5ba-41be-925b-8567166246e4:5:5665759
 * cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531
 * cf0603f27e347959822926d78430c77e4264f014a9c816fe33029befb4a80f12:0:008302bc-c5ba-41be-925b-8567166246e4.epub:0:2583509
 * 69ae298325a1a1d3f2dc4f6d6daa1db9b52ac523a1c455f19de4348184ce53e6:0:008302bc-c5ba-41be-925b-8567166246e4.metadata:0:327
 * ...
 *
 * - Hash entries schema version: schema version of the hash entries payload
 * - File data: metadata about the file represented by the hash entries
 *  - Zero: always 0
 *  - File ID: unique ID of the file represented by the hash entries
 *  - Nested hash entries count: number of nested hash entries within the file
 *  - Size in bytes: size in bytes of all nested hash entries
 * - Hash entries: list of hash entries representing the content behind the file
 *
 * There are two kind of hash entries:
 *
 * - 	The ones present in the reMarkable cloud API root.
 *  	The file data line contains no file ID, since the
 *  	hash entries represent the root of the reMarkable cloud API.
 *  	Nested hash entries contain no file extension.
 * - 	The hash entries represent the files (documents, folders,
 * 	 	notebooks, etc). The file data line contains a file ID,
 * 	 	and nested hash entries contain a file extension.
 */
export class HashEntries extends AbstractHashEntries {
	/**
	 * Payload of the hash entries.
	 *
	 * Example:
	 * ```
	 * 4
	 * 0:008302bc-c5ba-41be-925b-8567166246e4:5:5665759
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

	/**
	 * Number of nested hash entries.
	 *
	 * @type {number}
	 */
	#nestedHashEntriesCount

	/**
	 * Unique UUID identifier of the file associated with these hash entries.
	 *
	 * @type {string}
	 */
	#fileId

	/**
	 * Size of the file in bytes.
	 *
	 * @type {number}
 	 */
	#sizeInBytes

	constructor(hashEntriesPayload) {
		super()

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

		if (schemaVersionString !== '4') throw new IncompatibleSchemaVersionError()

		this.#schemaVersion = Number(schemaVersionString)

		const [_zero, fileId, nestedHashEntriesCount, sizeInBytes] = fileDataString.split(':')

		if (
			!schemaVersionString ||
			!_zero ||
			!fileId ||
			!nestedHashEntriesCount ||
			!sizeInBytes ||
			fileNestedHashEntriesStrings.length === 0
		) {
			throw new IncompatibleHashEntriesSchemaError(hashEntriesPayload)
		}

		this.#fileId = fileId
		this.#nestedHashEntriesCount = Number(nestedHashEntriesCount)
		this.#sizeInBytes = Number(sizeInBytes)
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
		return this.#nestedHashEntriesCount
	}

	/**
	 * Returns the unique UUID identifier for the file associated with this hash entries.
	 *
	 * @returns {string}
	 */
	get fileId() {
		return this.#fileId
	}

	/**
	 * Returns the size of the file in bytes.
	 *
	 * @returns {number}
	 */
	get sizeInBytes() {
		return this.#sizeInBytes
	}

	/**
	 * Returns true if the hash entries represents
	 * the reMarkable cloud hash entries.
	 *
	 * @returns {boolean}
	 */
	get rootHashEntries() {
		return this.#fileId === '.'
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
	 * Returns a hash entry from the payload.
	 *
	 * @returns {HashEntry}
	 */
	async hashEntry() {
		return new HashEntry([await this.checksum(), '0', this.fileId, this.hashEntriesList.length, this.sizeInBytesFromHashEntries].join(':'))
	}

	/**
	 * Returns a new instance of HashEntries with the given
	 * hash entry attached to the current hash entries.
	 *
	 * @param {HashEntry} newHashEntry - The hash entry to attach.
	 * @returns {HashEntries} - A new instance of HashEntries with the attached hash entry.
	 */
	attach(newHashEntry) {
		const newHashEntriesSizeInBytes = this.sizeInBytesFromHashEntries + newHashEntry.sizeInBytes

		let newHashEntriesPayload =
			(this.payload + '\n' + newHashEntry.payload)
			.replace(
				this.payload.split('\n')[1], // The second line contains the file data
				`0:${this.fileId}:${this.nestedHashEntriesCount + 1}:${newHashEntriesSizeInBytes}`
			)

		return new HashEntries(newHashEntriesPayload)
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

		const newHashEntriesSizeInBytes = this.sizeInBytesFromHashEntries - hashEntryToReplace.sizeInBytes + newHashEntry.sizeInBytes

		let newHashEntriesPayload = this.payload
			.replace(hashEntryToReplace.payload, newHashEntry.payload)
			.replace(
				this.payload.split('\n')[1], // The second line contains the file data
				`0:${this.fileId}:${this.nestedHashEntriesCount}:${newHashEntriesSizeInBytes}`
			)

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