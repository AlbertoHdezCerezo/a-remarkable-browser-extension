import HashEntry from '../../../../../src/lib/remarkableApi/internal/sync/hashEntry'

describe('HashEntry', () => {
	describe('.construct', () => {
		it('extracts content from hash entry payload', () => {
			const hashEntryPayload = 'cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531'

			const hashEntry = new HashEntry(hashEntryPayload)

			expect(hashEntry.payload).toBe(hashEntryPayload)
			expect(hashEntry.hash).toBe('cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d')
			expect(hashEntry.typeNumber).toBe(0)
			expect(hashEntry.sizeInBytes).toBe(26531)
			expect(hashEntry.fileId).toBe('008302bc-c5ba-41be-925b-8567166246e4')
			expect(hashEntry.fileExtension).toBe('content')
		})

		it('extracts content from root hash entry payload', () => {
			const hashEntryPayload = '883411c7fa93637f63ada401b9fbe06eda8d16363f946dc7f296a05c3b3ba91d:0:008302bc-c5ba-41be-925b-8567166246e4:5:5665759'

			const hashEntry = new HashEntry(hashEntryPayload)

			expect(hashEntry.payload).toBe(hashEntryPayload)
			expect(hashEntry.hash).toBe('883411c7fa93637f63ada401b9fbe06eda8d16363f946dc7f296a05c3b3ba91d')
			expect(hashEntry.typeNumber).toBe(5)
			expect(hashEntry.sizeInBytes).toBe(5665759)
			expect(hashEntry.fileId).toBe('008302bc-c5ba-41be-925b-8567166246e4')
			expect(hashEntry.fileExtension).toBe(undefined)
		})
	})

	describe('.rootHashEntry', () => {
		it('if given root hash entry, returns true', () => {
			const hashEntryPayload = '883411c7fa93637f63ada401b9fbe06eda8d16363f946dc7f296a05c3b3ba91d:0:008302bc-c5ba-41be-925b-8567166246e4:5:5665759'
			const hashEntry = new HashEntry(hashEntryPayload)

			expect(hashEntry.rootHashEntry).toBe(true)
		})

		it('if given non-root hash entry, returns false', () => {
			const hashEntryPayload = 'cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531'
			const hashEntry = new HashEntry(hashEntryPayload)

			expect(hashEntry.rootHashEntry).toBe(false)
		})
	})
})