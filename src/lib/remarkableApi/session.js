import { jwtDecode } from 'jwt-decode'
import FetchBasedHttpClient from '../utils/httpClient/fetchBasedHttpClient.js'

export const SESSION_URL = 'https://webapp-prod.cloud.remarkable.engineering/token/json/2/user/new'

/**
 * Represents an active device connection session.
 * This is a temporary token used to authenticate
 * requests with the reMarkable API.
 */
export default class Session {
	/**
	 * Creates a new Session instance.
	 *
	 * Used to interact with the reMarkable API
	 * via a session token with an expiration time.
	 *
	 * @param {DeviceConnection} deviceConnection - The device connection to create the session from.
	 * @returns {Session}
	 */
	static async from(deviceConnection) {
		const sessionResponse = await FetchBasedHttpClient.post(
			SESSION_URL,
			null,
			{Authorization: `Bearer ${deviceConnection.token}`}
		)

		if (sessionResponse.status !== 200) {
			throw new Error(`Failed to create session with Remarkable API: ${sessionResponse.statusText}`)
		}

		return new Session(await sessionResponse.text())
	}

	/**
	 * Device Connection ID
	 * @type {string}
	 */
	#deviceConnectionId

	/**
	 * Session token expiration time
	 * @type {Date}
	 */
	#expiredAt

	/**
	 * Session token used to authenticate requests
	 * @type {string}
	 */
	#token

	constructor(token) {
		const decodedToken = jwtDecode(token)

		this.#deviceConnectionId = decodedToken['device-id']
		this.#expiredAt = new Date(decodedToken.exp * 1000)
		this.#token = token
	}

	/**
	 * Returns the device connection ID associated to the session.
	 * @returns {string}
	 */
	get deviceConnectionId() {
		return this.#deviceConnectionId
	}

	/**
	 * Returns the session token expiration time.
	 * @returns {Date}
	 */
	get expiredAt() {
		return this.#expiredAt
	}

	/**
	 * Returns true if session token is expired.
	 * @returns {boolean}
	 */
	get expired() {
		return Date.now() >= this.expiredAt.getTime()
	}
}
