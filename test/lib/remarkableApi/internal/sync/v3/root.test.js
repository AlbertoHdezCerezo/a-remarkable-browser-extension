import {expect, jest} from '@jest/globals'
import {CONFIGURATION} from '../../../../../../src/lib/remarkableApi'
import {FetchBasedHttpClient} from '../../../../../../src/lib/utils/httpClient'
import {
	Root,
	UnreachableRootError,
	UnreachableRootHashEntriesError
} from '../../../../../../src/lib/remarkableApi/internal/sync/root'

describe('Root', () => {
	const session = global.remarkableApiSession

	describe('.fromSession', () => {
		it('fetches root information and hash entries from the reMarkable cloud account', async () => {
			FetchBasedHttpClient.get = jest.fn()
			FetchBasedHttpClient
				.get
				.mockImplementationOnce((...args) => {
					expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.root)
					expect(args[1]).toEqual({'Authorization': `Bearer ${session.token}`})

					return Promise.resolve({ok: true, status: 200, json: () => Promise.resolve(global.rootMetadata)})
				})
			FetchBasedHttpClient
				.get
				.mockImplementationOnce((...args) => {
					expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.files + global.rootHashChecksum)
					expect(args[1]).toEqual({'Authorization': `Bearer ${session.token}`})

					return Promise.resolve({ok: true, status: 200, text: () => Promise.resolve(global.rootHashEntriesPayload)})
				})

			const root = await Root.fromSession(session)

			expect(root).toBeDefined()
			expect(root.checksum).toBeDefined()
			expect(root.generation).toBeDefined()
			expect(root.hashEntries).toBeDefined()
		})

		it('if request to fetch root metadata fails, throws an UnreachableRootError', async () => {
			// Simulate a failure in fetching root metadata
			jest.spyOn(FetchBasedHttpClient, 'get')
				.mockImplementationOnce(() => {throw new Error('Network error')})

			try {
				await Root.fromSession(session)
			} catch (error) {
				expect(error).toBeInstanceOf(UnreachableRootError)
			}
		})

		it('if request to fetch root hash entries fails, throws an UnreachableRootHashEntriesError', async () => {
			// Simulate a failure in fetching root hash entries
			jest.spyOn(FetchBasedHttpClient, 'get')
				.mockImplementationOnce(() => Promise.resolve({json: () => Promise.resolve({ hash: 'test-checksum', generation: 1234567890 })}))
				.mockImplementationOnce(() => {throw new Error('Network error')})

			try {
				await Root.fromSession(session)
			} catch (error) {
				expect(error).toBeInstanceOf(UnreachableRootHashEntriesError)
			}
		})
	})
})