import { jest } from '@jest/globals'
import {setupHttpRecording} from '../../../../../helpers/pollyHelper'
import FetchBasedHttpClient from '../../../../../../src/lib/utils/httpClient/fetchBasedHttpClient'
import Device from '../../../../../../src/lib/remarkableApi/internal/token/device.js'
import Root, {
	UnreachableRootError,
	UnreachableRootHashEntriesError
} from '../../../../../../src/lib/remarkableApi/internal/sync/root'
import Session from '../../../../../../src/lib/remarkableApi/internal/token/session.js'

describe('Root', () => {
	setupHttpRecording()

	describe('.fromSession', () => {
		it('fetches root information and hash entries from the reMarkable cloud account', async () => {
			const deviceConnection = new Device(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			const root = await Root.fromSession(session)

			expect(root).toBeDefined()
			expect(root.checksum).toBeDefined()
			expect(root.generation).toBeDefined()
			expect(root.hashEntries).toBeDefined()
		})

		it('if request to fetch root metadata fails, throws an UnreachableRootError', async () => {
			const deviceConnection = new Device(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			// Simulate a failure in fetching root metadata
			jest.spyOn(FetchBasedHttpClient, 'get').mockImplementationOnce(() => {
				throw new Error('Network error')
			})

			try {
				await Root.fromSession(session)
			} catch (error) {
				expect(error).toBeInstanceOf(UnreachableRootError)
			}
		})

		it('if request to fetch root hash entries fails, throws an UnreachableRootHashEntriesError', async () => {
			const deviceConnection = new Device(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			// Simulate a failure in fetching root hash entries
			jest.spyOn(FetchBasedHttpClient, 'get')
				.mockImplementationOnce(() => Promise.resolve({
					json: () => Promise.resolve({ hash: 'test-checksum', generation: 1234567890 })
				}))
				.mockImplementationOnce(() => {
					throw new Error('Network error')
				})

			try {
				await Root.fromSession(session)
			} catch (error) {
				expect(error).toBeInstanceOf(UnreachableRootHashEntriesError)
			}
		})
	})
})