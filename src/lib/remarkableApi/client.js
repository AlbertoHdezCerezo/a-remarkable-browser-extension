import Session from './session'

export default class Client {
	static async from(deviceConnection, session = null, snapshot = null) {
		let newSession = session
		if(!newSession || newSession.expired) {
			newSession = await Session.from(deviceConnection)
		}

		let newSnapshot = snapshot
		if(!newSnapshot) {
			newSnapshot = await Snapshot.from(deviceConnection, newSession)
		}

		return new Client(deviceConnection, newSession, newSnapshot)
	}

	/**
	 * Device connection with a reMarkable tablet.
	 * Used to fetch reMarkable API tokens from the
	 * reMarkable cloud account associated with the
	 * device.
	 *
	 * @type {DeviceConnection}
	 */
	#deviceConnection

	/**
	 * reMarkable API session. Contains the authentication
	 * token used to access the reMarkable API.
	 *
	 * @type {Session}
	 */
	#session

	/**
	 * A snapshot of the current reMarkable cloud
	 * account associated to the given device
	 * connection. Tracks account files metadata
	 * and provides ways to keep the client up-to-date
	 * with the latest changes.
	 *
	 * @type {Snapshot}
	 */
	#snapshot

	constructor(deviceConnection, session, snapshot) {
		this.#deviceConnection = deviceConnection
		this.#session = session
		this.#snapshot = snapshot
	}

	/**
	 * Returns the current device connection.
	 *
	 * @returns {DeviceConnection}
	 */
	get deviceConnection() {
		return this.#deviceConnection
	}

	/**
	 * Returns the current reMarkable session.
	 *
	 * @returns {Session}
	 */
	get session() {
		return this.#session
	}



	/**
	 * Updates client session with a new session,
	 * if the existing one is missing or expired.
	 *
	 * @returns {Promise<Session>}
	 */
	async #regenerateSession() {
		if(!this.session || this.session.expired) {
			this.#session = await Session.from(this.deviceConnection)
		}

		return this.session
	}
}
