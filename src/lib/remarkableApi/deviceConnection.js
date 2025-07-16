import { v4 as uuidv4 } from 'uuid'
import { jwtDecode } from 'jwt-decode'
import FetchBasedHttpClient from '../utils/httpClient/fetchBasedHttpClient.js'

export const AUTHENTICATION_URL = 'https://webapp-prod.cloud.remarkable.engineering/token/json/2/device/new'

export const REMARKABLE_JWT_MAPPING = {
	id: 'device-id',
	description: 'device-desc',
}

/**
 * Represents a device connection to the reMarkable API.
 *
 * A device connection is a one-time binding between a reMarkable
 * account and a device, such as a browser or desktop application
 * (like this web browser extension).
 *
 * Once created, the device connection token is used to issue
 * session tokens, which can then be used to authenticate
 * requests to the reMarkable API endpoints.
 */
export default class DeviceConnection {
	/**
	 * Creates a new DeviceConnection instance.
	 *
	 * Uses the one-time code provided by remarkable under:
	 * https://my.remarkable.com/device/remarkable
	 *
	 * To generate a token that can be used to authenticate
	 * the device against the remarkable API endpoints.
	 *
	 * @param {string} oneTimeCode - The one-time code provided by remarkable.
	 * @param {string} deviceConnectionId - UUID v4 used to identify the device connection.
	 * @param description - A description of the device type, e.g., 'browser-chrome', 'desktop-macos', etc.
	 * @returns {Promise<DeviceConnection>}
	 */
	static async from(
		oneTimeCode,
		deviceConnectionId = uuidv4(),
		description = 'browser-chrome',
		httpClient = FetchBasedHttpClient
	) {
		const pairResponse = await httpClient.post(
			AUTHENTICATION_URL,
			{
				code: oneTimeCode,
				deviceID: deviceConnectionId,
				deviceDesc: description
			}
		)

		if (pairResponse.status !== 200) {
			throw new Error(`Failed to pair with Remarkable API: ${pairResponse.statusText}`)
		}

		return new DeviceConnection(await pairResponse.text())
	}

	/**
	 * remarkable device ID - UUID v4
	 * @type {string}
	 */
	#id

	/**
	 * Possible device types:
	 * -> browser-chrome, desktop-macos, desktop-windows, mobile-android, mobile-ios, remarkable
	 * @type {string}
	 */
	#description

	/**
	 * Time device connection was created
	 * @type {Date}
	 */
	#issuedAt

	/**
	 * One-Time Token returned by the remarkable API
	 * after pairing the device with the application.
	 * It is used to authenticate the device against
	 * the remarkable API endpoints
	 */
	#token

	constructor(token) {
		this.#token = token

		const decodedToken = jwtDecode(token)

		this.#id = decodedToken[REMARKABLE_JWT_MAPPING.id]
		this.#description = decodedToken[REMARKABLE_JWT_MAPPING.description]
		this.#issuedAt = new Date(decodedToken.iat * 1000)
	}

	/**
	 * Returns the device connection token.
	 * @returns {string}
	 */
	get token() {
		return this.#token
	}

	/**
	 * Returns the device connection ID.
	 * @returns {string}
	 */
	get id() {
		return this.#id
	}

	/**
	 * Returns the device description.
	 * This is a human-readable description of the device type.
	 * @returns {string}
	 */
	get description() {
		return this.#description
	}

	/**
	 * Returns the time when the device connection was created.
	 * @returns {Date}
	 */
	get issuedAt() {
		return this.#issuedAt
	}
}
