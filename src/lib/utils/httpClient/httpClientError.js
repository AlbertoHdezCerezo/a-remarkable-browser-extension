/**
 * Specialized Error class for HTTP client errors
 */
export default class HttpClientError extends Error {
	/**
	 * Response status code
	 * @type {number}
	 */
	#statusCode

	/**
	 * Original request that caused the error
	 * @type {Request}
	 */
	#request

	/**
	 * Original server response
	 * @type {Response}
	 */
	#response

	constructor(message, statusCode, request, response) {
		super(message)

		this.#statusCode = statusCode
		this.#request = request
		this.#response = response
	}

	/**
	 * Returns the HTTP status code of the error.
	 * @returns {number}
	 */
	get statusCode() {
		return this.#statusCode
	}

	/**
	 * Returns the original request that caused the error.
	 * @returns {Request}
	 */
	get request() {
		return this.#request
	}

	/**
	 * Returns the original server response that caused the error.
	 * @returns {Response}
	 */
	get response() {
		return this.#response
	}
}