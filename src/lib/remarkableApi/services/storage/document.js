export default class Document {
	/**
	 * Unique file identifier.
	 * @type {string}
	 */
	#id

	/**
	 * Document hash. Used to download its content
	 * @type {string}
	 */
	#hash

	/**
	 * Document type: pdf, epub or notebook
	 * @type {string}
	 */
	#documentType

	/**
	 * Document name.
	 * @type {string}
	 */
	#name

	/**
	 * Last time the document was modified.
	 * @type {Date}
	 */
	#lastModified

	/**
	 * Last time the document was opened.
	 * @type {Date}
	 */
	#lastOpened

	/**
	 * Parent folder identifier.
	 * @type {string}
	 */
	#parentId

	constructor(id, hash, documentType, name, lastModified, lastOpened, parentId) {
		this.#id = id
		this.#hash = hash
		this.#documentType = documentType
		this.#name = name
		this.#lastModified = lastModified
		this.#lastOpened = lastOpened
		this.#parentId = parentId
	}

	/**
	 * Returns the document identifier.
	 * @returns {string}
	 */
	get id() {
		return this.#id
	}

	/**
	 * Returns the document hash.
	 * @returns {string}
	 */
	get hash() {
		return this.#hash
	}

	/**
	 * Returns the document type.
	 * @returns {string}
	 */
	get documentType() {
		return this.#documentType
	}

	/**
	 * Returns the document name.
	 * @returns {string}
	 */
	get name() {
		return this.#name
	}

	/**
	 * Returns the last time the document was modified.
	 * @returns {Date}
	 */
	get lastModified() {
		return this.#lastModified
	}

	/**
	 * Returns the last time the document was opened.
	 * @returns {Date}
	 */
	get lastOpened() {
		return this.#lastOpened
	}

	/**
	 * Returns the parent folder identifier.
	 * @returns {string}
	 */
	get parentId() {
		return this.#parentId
	}
}