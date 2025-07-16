import { jest } from '@jest/globals'

export function mockSuccessfulFetchBasedHttpRequest(url, responseBody = {}, status = 200) {
	global.fetch = jest.fn().mockResolvedValue({
		ok: status >= 200 && status < 300,
		status,
		statusText: 'OK',
		json: async () => responseBody,
		text: async () => JSON.stringify(responseBody),
		headers: {
			get: (name) => {
				if (name === 'Content-Type') {
					return 'application/json'
				}
				return null
			}
		}
	})
}

export function mockFailedFetchBasedHttpRequest(url, status = 500, statusText = 'Internal Server Error') {
	global.fetch = jest.fn().mockResolvedValue({
		ok: false,
		status,
		statusText,
		json: async () => ({ error: statusText }),
		text: async () => JSON.stringify({ error: statusText }),
		headers: {
			get: (name) => {
				if (name === 'Content-Type') {
					return 'application/json'
				}
				return null
			}
		}
	})
}