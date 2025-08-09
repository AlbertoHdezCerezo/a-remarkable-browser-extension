import { jwtDecode } from 'jwt-decode'
import FetchBasedHttpClient from '../../../utils/httpClient/fetchBasedHttpClient'
import {CONFIGURATION} from "../../configuration.js";

export class UnsuccessfulSessionAuthenticationError extends Error {}

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
	 * @param {Device} deviceConnection - The device connection to create the session from.
	 * @returns {Session}
	 */
	static async from(deviceConnection) {
		try {
			const sessionResponse = await FetchBasedHttpClient.post(
				CONFIGURATION.endpoints.token.v2.endpoints.user,
				null,
				{Authorization: `Bearer ${deviceConnection.token}`}
			)

			return new Session(await sessionResponse.text())
		} catch (error) {
			throw new UnsuccessfulSessionAuthenticationError(
				`Failed to authenticate session: ${error.message}`
			)
		}
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
	 * Returns the session token used to authenticate requests.
	 * @returns {string}
	 */
	get token() {
		return this.#token
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
