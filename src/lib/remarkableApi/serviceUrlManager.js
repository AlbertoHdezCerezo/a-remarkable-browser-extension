import FetchBasedHttpClient from "../utils/httpClient/fetchBasedHttpClient.js";

export const SERVICE_DIRECTORY = {
	storage: "https://service-manager-production-dot-remarkable-production.appspot.com/service/json/1/document-storage?environment=production&group=auth0|5a68dc51cb30df3877a1d7c4&apiVer=2",
	notifications: "https://service-manager-production-dot-remarkable-production.appspot.com/service/json/1/notifications?environment=production&group=auth0%7C5a68dc51cb30df1234567890&apiVer=1"
}

export class InvalidServiceError extends Error {
	constructor(serviceName) {
		super(`Invalid service name: ${serviceName}. Supported services are: ${Object.keys(SERVICE_DIRECTORY).join(", ")}`)
		this.name = "InvalidServiceError"
	}
}

export class UnreachableServiceError extends Error {
	constructor(serviceName, message) {
		super(`Service is unreachable: ${serviceName} (Error: ${message}). Please check your network connection or service status.`)
		this.name = "UnreachableServiceError"
	}
}

/**
 * Service to fetch dynamic reMarkable API service URLs
 */
export default class ServiceUrlManager {
	/**
	 * Fetches the remarkable API URL for a given service name.
	 *
	 * @param {string} serviceName - The name of the service to fetch the URL for.
	 * @returns {Promise<string>} - The URL of the requested service.
	 * @throws {InvalidServiceError} - If the service name is invalid.
	 * @throws {UnreachableServiceError} - If the service is unreachable.
	 */
	static async urlForService(serviceName) {
		const service = SERVICE_DIRECTORY[serviceName]

		if (!service) {
			throw new InvalidServiceError(serviceName)
		}

		try {
			const serviceResponse = await FetchBasedHttpClient.get(service)
			const serviceResponsePayload = await serviceResponse.text()
			const serviceResponseJson = JSON.parse(serviceResponsePayload)

			if (serviceResponseJson.Status !== "OK") {
				throw new UnreachableServiceError(serviceName)
			}

			return serviceResponseJson.Host
		} catch (error) {
			throw new UnreachableServiceError(serviceName, error.message)
		}
	}
}
