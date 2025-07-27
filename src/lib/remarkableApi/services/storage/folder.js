export default class Folder {
	/**
	 * Unique file identifier.
	 * @type {string}
	 */
	#id

	/**
	 * Folder hash. Used to download its content
	 * @type {string}
	 */
	#hash

	/**
	 * Folder name.
	 * @type {string}
	 */
	#name

	/**
	 * Last time the folder was modified.
	 * @type {Date}
	 */
	#lastModified

	/**
	 * Parent folder identifier.
	 * @type {string}
 	 */
	#parentId

	constructor(id, hash, name, lastModified, parentId) {
		this.#id = id
		this.#hash = hash
		this.#name = name
		this.#lastModified = lastModified
		this.#parentId = parentId
	}

	/**
	 * Returns the folder identifier.
	 * @returns {string}
	 */
	get id() {
		return this.#id
	}

	/**
	 * Returns the folder hash.
	 * @returns {string}
	 */
	get hash() {
		return this.#hash
	}

	/**
	 * Returns the folder name.
	 * @returns {string}
	 */
	get name() {
		return this.#name
	}

	/**
	 * Returns the last time the folder was modified.
	 * @returns {Date}
	 */
	get lastModified() {
		return this.#lastModified
	}

	/**
	 * Returns the parent folder identifier.
	 * @returns {string}
	 */
	get parentId() {
		return this.#parentId
	}

	/**
	 * Checks if the folder is a root folder.
	 * The root folder is the top-level folder
	 * that has no parent.
	 * @returns {boolean}
	 */
	get isRoot() {
		return this.#parentId === null || this.#parentId === undefined
	}
}