import {expect, jest} from '@jest/globals'
import {mockRootRequest} from '../../../../../helpers/remarkableApiHelper'
import {FetchBasedHttpClient} from '../../../../../../src/lib/utils/httpClient'
import {
	Root,
	UnreachableRootError,
	UnreachableRootHashEntriesError
} from '../../../../../../src/lib/remarkableApi/internal/sync/v3/Root.js'
import * as Sync from "../../../../../../src/lib/remarkableApi/internal/sync/index.js";

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


	describe('#serialize', () => {
		it('coerces root instance to a JSON stringified representation of it', () => {
			const serializedRoot = global.root.serialize()

			const parsedSerializedRoot = JSON.parse(serializedRoot)

			expect(parsedSerializedRoot.hashEntries).toEqual(global.root.hashEntries.payload)
			expect(parsedSerializedRoot.generation).toEqual(global.root.generation)
			expect(parsedSerializedRoot.checksum).toEqual(global.root.checksum)
		})
	})

	describe('.deserialize', () => {
		it('coerces string representing a serialized root to a root instance', () => {
			const expectedRoot = global.root

			const serializedRoot = global.root.serialize()

			const deserializedRoot = Sync.V3.Root.deserialize(serializedRoot)

			expect(deserializedRoot.hashEntries.payload).toEqual(expectedRoot.hashEntries.payload)
			expect(deserializedRoot.generation).toEqual(expectedRoot.generation)
			expect(deserializedRoot.checksum).toEqual(expectedRoot.checksum)
		})
	})
})