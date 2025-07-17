import { jest } from '@jest/globals'
import ServiceUrlManager, {InvalidServiceError, UnreachableServiceError} from '../../../src/lib/remarkableApi/serviceUrlManager'
import {setupHttpRecording} from '../../helpers/pollyHelper'
import FetchBasedHttpClient from "../../../src/lib/utils/httpClient/fetchBasedHttpClient.js";

describe('ServiceUrlManager', () => {
	setupHttpRecording()

	describe('.urlForService', () => {
		it('if request storage service URL, fetches service URL from remarkable API', async () => {
			const serviceUrl = await ServiceUrlManager.urlForService('storage')

			expect(serviceUrl).toBeDefined()
			expect(serviceUrl).toContain('document-storage-production-dot-remarkable-production.appspot.com')
		}, 50000)

		it('if request notifications service URL, fetches service URL from remarkable API', async () => {
			const serviceUrl = await ServiceUrlManager.urlForService('notifications')

			expect(serviceUrl).toBeDefined()
			expect(serviceUrl).toContain('eu.tectonic.remarkable.com')
		}, 50000)

		it('if request unsupported service URL, raises error', async () => {
			await expect(ServiceUrlManager.urlForService('unsupported-service'))
				.rejects
				.toThrow(InvalidServiceError)
		})

		it('if service is unreachable due to network problems, raises error', async () => {
			jest.spyOn(FetchBasedHttpClient, 'get').mockImplementationOnce(() => {
				return Promise.reject(new Error('Network Error'))
			})

			await expect(ServiceUrlManager.urlForService('storage'))
				.rejects
				.toThrow(UnreachableServiceError)
		})

		it('if service is unreachable due to API problems, raises error', async () => {
			jest.spyOn(FetchBasedHttpClient, 'get').mockImplementationOnce(() => {
				return Promise.resolve({
					text: () => Promise.resolve(JSON.stringify({Status: 'ERROR', Host: ''}))
				})
			})

			await expect(ServiceUrlManager.urlForService('storage'))
				.rejects
				.toThrow(UnreachableServiceError)
		})
	})
})
