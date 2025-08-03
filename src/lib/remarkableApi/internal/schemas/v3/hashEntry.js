import {CONFIGURATION} from '../../../configuration'
import FetchBasedHttpClient from '../../../../utils/httpClient/fetchBasedHttpClient'

export class IncompatibleHashEntrySchemaError extends Error {
	constructor(
		hashEntryPayload,
		message = `
			Hash entry payload is incompatible with the Hash Entry v4 schema.
			Expected payload to be a string with the following format:
			<checksum>:<zero>:<fileId>.<fileExtension>:<nestedHashEntriesCount>:<sizeInBytes>
			Received payload: ${hashEntryPayload}
		`
	) {
		super(message)
		this.name = 'IncompatibleHashEntrySchemaError'
	}
}

export class UnreachableHashEntryContentError extends Error {
	constructor(
		originalError,
		message = `
			Attempt to fetch hash entry content from reMarkable cloud API failed.
			Original error message: ${originalError.message}
		`
	) {
		super(message)
		this.name = 'UnreachableHashEntryContentError'
		this.stack = `${this.stack}\nCaused by: ${originalError.stack}`
	}
}

/**
 * Represents a reMarkable cloud API hash entry.
 *
 * A hash entry is a string composed by a set of
 * fields separated by a colon (:).
 *
 * Example: cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531
 *
 * - checksum: checksum of the content behind the hash entry
 * - zero: always 0
 * - file ID & Extension: unique ID of reMarkable cloud file the hash entry is associated with
 * - Number of nested hash entries: number of sub-hash entries within content behind the hash entry
 * - Size in bytes: size of the content behind the hash entry in bytes
 *
 * There are two kind of hash entries:
 *
 * - 	The ones present in the reMarkable cloud API root.
 * 		Each hash entry represents a file (document, folder,
 * 		notebook, etc). They have no file extension, and they
 * 		always have a number of nested hash entries.
 *
 * - 	The ones present under a reMarkable cloud API root
 * 		hash entry. Each hash entry represents a part of the
 * 		total content of a file. They have a file extension,
 * 		and they always have a zero as the second field.
 */
export class HashEntry {
	/**
	 * Payload of the hash entry.
	 *
	 * Example:
	 * ```
	 * cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531
	 * ```
	 *
	 * @typedef {string}
	 */
	#payload

	/**
	 * Checksum of the content behind this hash entry.
	 *
	 * @typedef {string}
	 */
	#checksum

	/**
	 * Number of hash entries behind this hash entry.
	 * Set to 0 for file hash entries.
	 *
	 * @type {number}
	 */
	#nestedHashEntriesCount

	/**
	 * Size of the content behind this hash entry in bytes.
	 *
	 * @type {number}
	 */
	#sizeInBytes

	/**
	 * Unique UUID identifier for the file associated with this hash entry
	 * (e.g. a document, folder notebook, etc).
	 *
	 * @type {string}
	 */
	#fileId

	/**
	 * File extension associated with the hash entry.
	 * Only present for file hash entries (missing in
	 * root hash entries).
	 *
	 * @type {string}
 	 */
	#fileExtension

	constructor(hashEntryPayload) {
		this.#payload = hashEntryPayload

		const [checksum, _zero, subFileHash, nestedHashEntriesCount, sizeInBytes] = hashEntryPayload.split(':')

		if (!checksum || !_zero || !subFileHash || !nestedHashEntriesCount || !sizeInBytes) {
			throw new IncompatibleHashEntrySchemaError(hashEntryPayload)
		}

		const [fileId, fileExtension] = subFileHash.split('.')

		this.#checksum = checksum
		this.#nestedHashEntriesCount = Number(nestedHashEntriesCount)
		this.#sizeInBytes = Number(sizeInBytes)
		this.#fileId = fileId
		this.#fileExtension = fileExtension
	}

	/**
	 * Returns the hash entry payload.
	 *
	 * @returns {string}
	 */
	get payload() {
		return this.#payload
	}

	/**
	 * Returns the checksum of the content behind this hash entry.
	 *
	 * @returns {string}
	 */
	get checksum() {
		return this.#checksum
	}

	/**
	 * Returns the number of nested hash entries behind this hash entry.
	 *
	 * @returns {number}
	 */
	get nestedHashEntriesCount() {
		return this.#nestedHashEntriesCount
	}

	/**
	 * Returns the size of the content behind this hash entry in bytes.
	 *
	 * @returns {number}
	 */
	get sizeInBytes() {
		return this.#sizeInBytes
	}

	/**
	 * Returns the unique UUID identifier for the file associated with this hash entry.
	 *
	 * @returns {string}
	 */
	get fileId() {
		return this.#fileId
	}

	/**
	 * Returns the file extension for the hash entry.
	 * If the hash entry is a root entry, this will be null.
	 *
	 * @returns {string | null}
	 */
	get fileExtension() {
		return this.#fileExtension
	}

	/**
	 * Returns true if the hash entry is a root entry.
	 *
	 * @returns {boolean}
	 */
	get rootHashEntry() {
		return this.fileExtension === null || this.fileExtension === undefined
	}

	/**
	 * Returns the URL containing the hash entry content.
	 *
	 * @returns {string}
	 */
	get url() {
		return CONFIGURATION.endpoints.sync.v3.endpoints.files + this.checksum
	}

	/**
	 * Fetches the content of the hash entry.
	 *
	 * @param {Session} session - The session object containing the authentication token.
	 * @returns {Promise<object|string>}
	 */
	async content(session) {
		try {
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
			} catch {
				return contentRawPayload
			}
		} catch (error) {
			throw new UnreachableHashEntryContentError(error)
		}
	}
}