import Request from './request.js'

/**
 * HTTP client for JS Node.js environments.
 *
 * Underneath the library uses the `https` module from Node.js.
 * This library is compatible with browser-extension environments
 * but not with browser environments.
 *
 * @class
 */
export default class HttpsBasedHttpClient {
  /**
   * The Node.js `https` module, lazily loaded to allow mocking in tests.
   *
   * @private
   * @type {Object}
   */
  static #https

  /**
   * Executes an HTTP request using the Node.js `https` module.
   *
   * @param {string} url - The URL to which the request is sent.
   * @param {Object} headers - The headers to be sent with the request.
   * @returns {Promise<Response>} - A promise that resolves to a Response object.
   */
  static async get (url, headers = {}) {
    return await this.#executeRequest(url, 'GET', null, headers)
  }

  /**
   * Executes an HTTP POST request using the Node.js `https` module.
   *
   * @param {string} url - The URL to which the request is sent.
   * @param {Object|string|Buffer|ArrayBuffer} body - The body of the request.
   * @param {Object} headers - The headers to be sent with the request.
   * @returns {Promise<Response>} - A promise that resolves to a Response object.
   */
  static async post (url, body, headers = {}) {
    return await this.#executeRequest(url, 'POST', body, headers)
  }

  /**
   * Executes an HTTP PUT request using the Node.js `https` module.
   *
   * @param {string} url - The URL to which the request is sent.
   * @param {Object|string|Buffer|ArrayBuffer} body - The body of the request.
   * @param {Object} headers - The headers to be sent with the request.
   * @returns {Promise<Response>} - A promise that resolves to a Response object.
   */
  static async put (url, body, headers = {}) {
    return await this.#executeRequest(url, 'PUT', body, headers)
  }

  /**
   * Executes an HTTP PATCH request using the Node.js `https` module.
   *
   * @param {string} url - The URL to which the request is sent.
   * @param {Object|string|Buffer|ArrayBuffer} body - The body of the request.
   * @param {Object} headers - The headers to be sent with the request.
   * @returns {Promise<Response>} - A promise that resolves to a Response object.
   */
  static async patch (url, body, headers = {}) {
    return await this.#executeRequest(url, 'PATCH', body, headers)
  }

  /**
   * Executes an HTTP DELETE request using the Node.js `https` module.
   *
   * @param {string} url - The URL to which the request is sent.
   * @param {Object} headers - The headers to be sent with the request.
   * @returns {Promise<Response>} - A promise that resolves to a Response object.
   */
  static async delete (url, headers = {}) {
    return await this.#executeRequest(url, 'DELETE', null, headers)
  }

  static async #executeRequest (url, method, body, headers) {
    const request = new Request(url, method, headers, body)

    /**
     * This is a lazy-load of the Node.js `https` module. It is done to
     * allow Polly.JS to mock the `https` module during tests.
     */
    if (!this.#https) { this.#https = await import('https') }

    return await new Promise((resolve, reject) => {
      const httpsRequest = this.#https.request(
        this.#httpsRequestPayload(request),
        (response) => {
          let responseData = ''

          response.on('data', (chunk) => responseData += chunk)

          response.on('end', () =>
            resolve(new Response(responseData, { status: response.statusCode, statusText: response.statusMessage }))
          )
        }
      )

      httpsRequest.on('error', (error) => {reject(error)})

      if (request.body != null) httpsRequest.write(request.body)

      httpsRequest.end()
    })
  }

  static #httpsRequestPayload (request) {
    return {
      method: request.method,
      hostname: request.url.hostname,
      path: request.url.pathname + request.url.search,
      headers: request.headers.entries
    }
  }
}
