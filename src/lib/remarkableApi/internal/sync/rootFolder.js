import {CONFIGURATION} from '../../configuration'
import HashEntries from './hashEntries'
import FetchBasedHttpClient from '../../../utils/httpClient/fetchBasedHttpClient'

export default class RootFolder {
	/**
	 * Creates a new RootHash instance from the
	 * reMarkable API root endpoint response.
	 *
	 * @param {Session} session - The reMarkable API session.
	 * @returns {Promise<RootFolder>} A promise that resolves to a RootHash instance.
	 */
	static async fromRootEndpoint(session) {
		const rootEndpoint = CONFIGURATION.endpoints.sync.v3.endpoints.root

		const rootResponse = await FetchBasedHttpClient.get(
			rootEndpoint, {'Authorization': `Bearer ${session.token}`}
		)

		const rootPayload = await rootResponse.json()
		const filesEndpoint = CONFIGURATION.endpoints.sync.v3.endpoints.files

		const rootHashResponse = await FetchBasedHttpClient.get(
			filesEndpoint + rootPayload.hash, {'Authorization': `Bearer ${session.token}`}
		)

		const rootHashPayload = await rootHashResponse.text()

		return new RootFolder(session, new HashEntries(rootHashPayload.trim()))
	}

	/**
	 * reMarkable API session.
	 * @type {Session}
	 */
	#session

	/**
	 * Hash entries handling of the root hash payload.
	 * @type {HashEntries}
	 */
	#hashEntries

	/**
	 * Collection of all files within client's cloud account.
	 */
	#files

	/**
	 * @param {Session} session - The reMarkable API session.
	 * @param {HashEntries} hashEntries - The hash entries handling of the root hash payload.
	 */
	constructor(session, hashEntries) {
		this.#session = session
		this.#hashEntries = hashEntries
	}

	/**
	 * Returns the reMarkable API session.
	 * @returns {Session}
	 */
	get session() {
		return this.#session
	}

	/**
	 * Returns the hash entries handling of the root hash payload.
	 * @returns {HashEntries}
	 */
	get hashEntries() {
		return this.#hashEntries
	}

	async files(){
		if (this.#files) return this.#files

		const filesEndpoint = CONFIGURATION.endpoints.sync.v3.endpoints.files

		const hashEntriesResponses = await Promise.all(
			this.#hashEntries.hashEntriesList.map(hashEntry => {
				return FetchBasedHttpClient.get(
					filesEndpoint + hashEntry.hash,
					{'Authorization': `Bearer ${this.session.token}`}
				)
			})
		)

		const hashEntriesPayloads = await Promise.all(
			hashEntriesResponses.map(response => response.text())
		)

		this.#files = hashEntriesPayloads.map(payload => new HashEntries(payload.trim()))

		return this.#files
	}
}
