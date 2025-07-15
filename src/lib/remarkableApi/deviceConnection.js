import { v4 as uuidv4 } from 'uuid'
import FetchBasedHttpClient from '../utils/httpClient/fetchBasedHttpClient.js'

const AUTHENTICATION_URL = 'https://webapp-prod.cloud.remarkable.engineering/token/json/2/device/new'

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
	 * One-Time Token returned by the remarkable API
	 * after pairing the device with the application.
	 * It is used to authenticate the device against
	 * the remarkable API endpoints
	 */
	#token

	constructor(token) {
		console.log(token)
		this.#token = token
	}

	get token() {
		return this.#token
	}
}
