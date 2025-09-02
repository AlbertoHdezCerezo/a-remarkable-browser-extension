import {jwtDecode} from 'jwt-decode'
import {CONFIGURATION} from '../../configuration.js'
import {FetchBasedHttpClient} from '../../../utils/httpClient'

export class UnsuccessfulSessionAuthenticationError extends Error {}

/**
 * Represents an active device connection session.
 * This is a temporary token used to authenticate
 * requests with the reMarkable API.
 */
export class Session {
	/**
	 * Creates a new Session instance.
	 *
	 * Used to interact with the reMarkable API
	 * via a session token with an expiration time.
	 *
	 * @param {Device} device - The device connection to create the session from.
	 * @returns {Session}
	 */
	static async from(device) {
		try {
			const sessionResponse = await FetchBasedHttpClient.post(
				CONFIGURATION.endpoints.token.v2.endpoints.user,
				null,
				{Authorization: `Bearer ${device.token}`}
			)

			return new Session(await sessionResponse.text())
		} catch (error) {
			throw new UnsuccessfulSessionAuthenticationError(
				`Failed to authenticate session: ${error.message}`
			)
		}
	}

	/**
	 * Device ID
	 *
	 * @type {string}
	 */
	#deviceId

	/**
	 * Session token expiration time
	 *
	 * @type {Date}
	 */
	#expiredAt

	/**
	 * Session token used to authenticate requests
	 *
	 * @type {string}
	 */
	#token

	constructor(token) {
		const decodedToken = jwtDecode(token)

		this.#deviceId = decodedToken['device-id']
		this.#expiredAt = new Date(decodedToken.exp * 1000)
		this.#token = token
	}

	/**
	 * Returns the session token used to authenticate requests.
	 *
	 * @returns {string}
	 */
	get token() {
		return this.#token
	}

	/**
	 * Returns the device ID associated to the session.
	 *
	 * @returns {string}
	 */
	get deviceId() {
		return this.#deviceId
	}

	/**
	 * Returns the session token expiration time.
	 *
	 * @returns {Date}
	 */
	get expiredAt() {
		return this.#expiredAt
	}

	/**
	 * Returns true if session token is expired.
	 *
	 * @returns {boolean}
	 */
	get expired() {
		return Date.now() >= this.expiredAt.getTime()
	}
}
