import Body from './body.js'

/**
 * Represents an HTTP request
 *
 * @class
 */
export default class Request {
  /**
	 * @private
	 * @type {URL}
	 */
  #url
  /**
	 * @private
	 * @type {string}
	 */
  #method
  /**
	 * @private
	 * @type {Object}
	 */
  #headers
  /**
	 * @private
	 * @type {Body}
	 */
  #body

  /**
	 * Creates a new instance of Request.
	 *
	 * @param {string} url_string - The URL string for the request.
	 * @param {string} [method='GET'] - The HTTP method for the request (e.g., 'GET', 'POST').
	 * @param {Object} [headers=null] - An object containing headers for the request.
	 * @param {Body|Object|string|Buffer|ArrayBuffer|null} [body=null] - The body of the request, can be an instance of Body or raw data.
	 */
  constructor (
    url_string,
    method = 'GET',
    headers = null,
    body = null
  ) {
    this.#url = this.#coerceStringToURL(url_string)
    this.#method = method.toUpperCase()

    if (headers !== null) this.#headers = headers
    if (body !== null) this.#body = body instanceof Body ? body : new Body(body)
  }

  /**
	 * Transforms URL strings to ensure they are compatible
	 * with the URL class constructor.
	 *
	 * @param {string} url_string - The URL string to be coerced.
	 * @returns {module:url.URL | URL}
	 */
  #coerceStringToURL (url_string) {
    let url_compatible_string = url_string

    if (!url_string.startsWith('http://') &&
				!url_string.startsWith('https://')) {
      url_compatible_string = `https://${url_string}`
    }

    return new URL(url_compatible_string)
  }

  /**
	 * Returns the URL of the request.
	 *
	 * @returns {URL}
	 */
  get url () {
    return this.#url
  }

  /**
	 * Returns the HTTP method of the request.
	 *
	 * @returns {string}
	 */
  get method () {
    return this.#method
  }

  /**
	 * Returns the headers of the request.
	 *
	 * @returns {Object}
	 */
  get headers () {
    return this.#headers
  }

  /**
	 * Returns the body of the request.
	 *
	 * @returns {Object|string|Buffer|ArrayBuffer}
	 */
  get rawBody () {
    return this.#body?.rawPayload
  }

  /**
	 * Returns `Request` body payload in a serializer format.
	 *
	 * @returns {string|Buffer|ArrayBuffer}
	 */
  get body () {
    return this.#body?.payload
  }
}
