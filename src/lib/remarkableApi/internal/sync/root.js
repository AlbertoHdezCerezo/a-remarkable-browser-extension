import {CONFIGURATION} from '../../configuration'
import HashEntries from '../schemas/v4/hashEntries'
import FetchBasedHttpClient from '../../../utils/httpClient/fetchBasedHttpClient'

/**
 * Class representing reMarkable cloud root.
 *
 * The root represents the collection of all files
 * (documents, folders, templates, etc.) within the
 * user's reMarkable cloud account.
 *
 * It is represented by a hash, a generation number
 * and a schema version. The hash content is a list
 * of all the hash entries of the files within the
 * reMarkable cloud account.
 *
 * Hence, the root works as a snapshot of the whole
 * reMarkable cloud account at the time of the request.
 * Every operation that modifies information in the
 * reMarkable cloud account will result in a new root
 * hash being generated, with its own generation number
 * and specific hash entries.
 */
export default class Root {
	/**
	 * Fetches Root instance from a reMarkable API session.
	 *
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<Root>}
	 */
	static async fromSession(session) {
		const rootEndpoint = CONFIGURATION.endpoints.sync.v3.endpoints.root

		const rootResponse = await FetchBasedHttpClient.get(
			rootEndpoint, {'Authorization': `Bearer ${session.token}`}
		)

		const rootPayload = await rootResponse.json()
		const rootHash = rootPayload.hash
		const rootGeneration = Number(rootPayload.generation)
		const filesEndpoint = CONFIGURATION.endpoints.sync.v3.endpoints.files

		const rootHashResponse = await FetchBasedHttpClient.get(
			filesEndpoint + rootHash, {'Authorization': `Bearer ${session.token}`}
		)

		const rootHashPayload = await rootHashResponse.text()

		return new Root(rootHash, rootGeneration, new HashEntries(rootHashPayload.trim()))
	}

	/**
	 * reMarkable root hash.
	 *
	 * @typedef {string}
	 */
	#hash

	/**
	 * reMarkable root generation number.
	 *
	 * @typedef {number}
	 */
	#generation

	/**
	 * Hash entries representing the root content.
	 * Each entry represents a file in the reMarkable cloud account.
	 *
	 * @type {HashEntries}
	 */
	#hashEntries

	constructor(hash, generation, hashEntries) {
		this.#hash = hash
		this.#generation = generation
		this.#hashEntries = hashEntries
	}

	/**
	 * Returns the root hash.
	 *
	 * @returns {string}
	 */
	get hash() {
		return this.#hash
	}

	/**
	 * Returns the root generation number.
	 * Each number represents a different
	 * snapshot of the reMarkable cloud file system.
	 *
	 * @returns {number}
	 */
	get generation() {
		return this.#generation
	}

	/**
	 * Returns the hash entries representing the root content.
	 * Each entry represents a file in the reMarkable cloud account.
	 *
	 * @returns {HashEntries}
	 */
	get hashEntries() {
		return this.#hashEntries
	}
}
