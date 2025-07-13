import Request from './request.js'

/**
 * HTTP client for JS web-browser environments.
 *
 * Underneath the library uses the `fetch` API from the browser.
 *
 * @class
 */
export default class FetchBasedHttpClient {
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

		return await new Promise(async (resolve, reject) => {
			const response = await fetch(request.url.toString(), {
				method: request.method,
				headers: request.headers.entries,
				body: request.body
			})

			const responseData = await response.text()

			if (response.ok) {
				resolve(new Response(responseData, { status: response.status, statusText: response.statusText }))
			} else {
				reject(new Error(`HTTP error: ${response.status} - ${responseData}`))
			}
		})
	}
}
