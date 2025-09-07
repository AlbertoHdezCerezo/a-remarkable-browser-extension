import {expect, jest} from '@jest/globals'
import {mockRootRequest} from '../../../../../helpers/remarkableApiHelper'
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
			const fetchBasedHttpClientGetMock = jest.fn()
			mockRootRequest(fetchBasedHttpClientGetMock, session)
			FetchBasedHttpClient.get = fetchBasedHttpClientGetMock

			const root = await Root.fromSession(session)

			expect(root).toBeDefined()
			expect(root.checksum).toBeDefined()
			expect(root.generation).toBeDefined()
			expect(root.hashEntries).toBeDefined()
		})

		it('if request to fetch root metadata fails, throws an UnreachableRootError', async () => {
			jest.spyOn(FetchBasedHttpClient, 'get')
				.mockImplementationOnce(() => {throw new Error('Network error')})

			try {
				await Root.fromSession(session)
			} catch (error) {
				expect(error).toBeInstanceOf(UnreachableRootError)
			}
		})

		it('if request to fetch root hash entries fails, throws an UnreachableRootHashEntriesError', async () => {
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