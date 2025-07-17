import FetchBasedHttpClient from "../utils/httpClient/fetchBasedHttpClient.js";

export const SERVICE_DIRECTORY = {
	storage: "https://service-manager-production-dot-remarkable-production.appspot.com/service/json/1/document-storage?environment=production&group=auth0%7C5a68dc51cb30df1234567890&apiVer=2\n",
	notifications: "https://service-manager-production-dot-remarkable-production.appspot.com/service/json/1/notifications?environment=production&group=auth0%7C5a68dc51cb30df1234567890&apiVer=1\n"
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

export default class ServiceUrlManager {
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
