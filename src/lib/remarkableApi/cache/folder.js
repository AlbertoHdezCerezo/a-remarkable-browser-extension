export default class Folder {
	/**
	 * Folder from the reMarkable cloud API.
	 *
	 * @type {Folder}
	 */
	#apiFolder

	constructor(apiFolder) {
		this.#apiFolder
	}

	/**
	 * Returns the API folder object
	 *
	 * @returns {ApiFolder}
	 */
	get apiFolder() {
		return this.#apiFolder
	}
}
