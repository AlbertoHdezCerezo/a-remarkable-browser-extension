/**
 * Represents the payload of an HTTP request
 *
 * @class
 */
export default class Body {
  /**
	 * Raw payload of the HTTP request.
	 *
	 * @private
	 *
	 * @type {Object|string|Buffer|ArrayBuffer}
	 */
  #raw_payload

  /**
	 * Creates a new instance of Body.
	 *
	 * @param {Object|string|Buffer|ArrayBuffer} raw_payload - The raw payload of the HTTP request.
	 */
  constructor (raw_payload) {
    this.#raw_payload = raw_payload
  }

  /**
	 * Returns the raw payload of the HTTP request.
	 *
	 * @returns {Object|string|Buffer|ArrayBuffer}
	 */
  get rawPayload () {
    return this.#raw_payload
  }

  /**
	 * Returns body payload in a serializer format,
	 * compatible with HTTP client libraries to be
	 * used in the request.
	 *
	 * @returns {string|Buffer|ArrayBuffer}
	 */
  get payload () {
    if (
      this.#raw_payload instanceof Object &&
			!(this.#raw_payload instanceof Buffer) &&
			!(this.#raw_payload instanceof ArrayBuffer)
    ) { return JSON.stringify(this.#raw_payload) }

    return this.#raw_payload
  }
}
