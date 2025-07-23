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
}
