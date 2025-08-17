import {setupHttpRecording} from '../../../../../helpers/pollyHelper'
import {CONFIGURATION} from '../../../../../../src/lib/remarkableApi/configuration'
import Session from '../../../../../../src/lib/remarkableApi/internal/token/session'
import {
	HashEntry,
	IncompatibleHashEntrySchemaError, UnreachableHashEntryContentError
} from '../../../../../../src/lib/remarkableApi/internal/schemas/v3/hashEntry'

describe('HashEntry', () => {
	setupHttpRecording()

	describe('.construct', () => {
		it('extracts content from hash entry payload', () => {
			const hashEntryPayload = 'cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531'

			const hashEntry = new HashEntry(hashEntryPayload)

			expect(hashEntry.payload).toBe(hashEntryPayload)
			expect(hashEntry.checksum).toBe('cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d')
			expect(hashEntry.nestedHashEntriesCount).toBe(0)
			expect(hashEntry.sizeInBytes).toBe(26531)
			expect(hashEntry.fileId).toBe('008302bc-c5ba-41be-925b-8567166246e4')
			expect(hashEntry.fileExtension).toBe('content')
		})

		it('extracts content from root hash entry payload', () => {
			const hashEntryPayload = '883411c7fa93637f63ada401b9fbe06eda8d16363f946dc7f296a05c3b3ba91d:0:008302bc-c5ba-41be-925b-8567166246e4:5:5665759'

			const hashEntry = new HashEntry(hashEntryPayload)

			expect(hashEntry.payload).toBe(hashEntryPayload)
			expect(hashEntry.checksum).toBe('883411c7fa93637f63ada401b9fbe06eda8d16363f946dc7f296a05c3b3ba91d')
			expect(hashEntry.nestedHashEntriesCount).toBe(5)
			expect(hashEntry.sizeInBytes).toBe(5665759)
			expect(hashEntry.fileId).toBe('008302bc-c5ba-41be-925b-8567166246e4')
			expect(hashEntry.fileExtension).toBe(undefined)
		})

		it('if payload does not resemble a v4 hash entry, throws an error', () => {
			const hashEntryPayload = 'cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content'

			try {
				new HashEntry(hashEntryPayload)
			} catch (error) {
				expect(error).toBeInstanceOf(IncompatibleHashEntrySchemaError)
			}
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

	describe('#url', () => {
		it('returns the URL to fetch the content of the file represented by this hash entry', () => {
			const hashEntryPayload = 'cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531'
			const hashEntry = new HashEntry(hashEntryPayload)

			expect(hashEntry.url).toBe(CONFIGURATION.endpoints.sync.v3.endpoints.files + hashEntry.checksum)
		})
	})

	describe('#content', () => {
		it('returns content behind hash entry', async () => {
			const session = global.remarkableApiSession
			const hashEntryPayload = global.samplePdfHashEntryPayload
			const hashEntry = new HashEntry(hashEntryPayload)

			const hashEntryContent = await hashEntry.content(session)

			expect(typeof hashEntryContent).toBe('string')
		})

		it('if hash entry content cannot be fetched, throws an error', async () => {
			const session = global.remarkableApiSession
			const hashEntryPayload = 'thisisnotavalidchecksum:0:0bacf12a-64fa-4fe5-9f28-16a043e8c809.metadata:0:314'
			const hashEntry = new HashEntry(hashEntryPayload)

			try {
				await hashEntry.content(session)
			} catch (error) {
				expect(error).toBeInstanceOf(UnreachableHashEntryContentError)
			}
		})
	})
})