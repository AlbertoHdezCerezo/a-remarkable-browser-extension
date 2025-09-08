import {
	HashEntriesFactory,
	UnsupportedHashEntriesPayloadError
} from '../../../../../src/lib/remarkableApi/internal/schemas/hashEntriesFactory'
import {HashEntries as V3HashEntries} from '../../../../../src/lib/remarkableApi/internal/schemas/v3/HashEntries.js'
import {HashEntries as V4HashEntries} from '../../../../../src/lib/remarkableApi/internal/schemas/v4/HashEntries.js'

describe('HashEntriesFactory', () => {
	describe('.fromPayload', () => {
		it('given a v4 hash entries payload, returns a v4 hash entries instance', () => {
			const hashEntriesPayload = `
				4
				0:008302bc-c5ba-41be-925b-8567166246e4:5:5665759
				cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531
				cf0603f27e347959822926d78430c77e4264f014a9c816fe33029befb4a80f12:0:008302bc-c5ba-41be-925b-8567166246e4.epub:0:2583509
				69ae298325a1a1d3f2dc4f6d6daa1db9b52ac523a1c455f19de4348184ce53e6:0:008302bc-c5ba-41be-925b-8567166246e4.metadata:0:327
				63fdd266a9e733b0807f9e884e3d7c0e76cbe3100f72bef4f67865172cbbeccd:0:008302bc-c5ba-41be-925b-8567166246e4.pagedata:0:2346
				322e173fac914ce59df9db85a533b6eb65d9e0e8807d07ca57f9c6e18b76af29:0:008302bc-c5ba-41be-925b-8567166246e4.pdf:0:3053046
			`.trim().replace(/\t/g, '')

			const hashEntries = HashEntriesFactory.fromPayload(hashEntriesPayload)

			expect(hashEntries).toBeInstanceOf(V4HashEntries)
			expect(hashEntries.schemaVersion).toBe(4)
		})

		it('given a v3 hash entries payload, returns a v3 hash entries instance', () => {
			const hashEntriesPayload = `
				3
				cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531
				cf0603f27e347959822926d78430c77e4264f014a9c816fe33029befb4a80f12:0:008302bc-c5ba-41be-925b-8567166246e4.epub:0:2583509
				69ae298325a1a1d3f2dc4f6d6daa1db9b52ac523a1c455f19de4348184ce53e6:0:008302bc-c5ba-41be-925b-8567166246e4.metadata:0:327
				63fdd266a9e733b0807f9e884e3d7c0e76cbe3100f72bef4f67865172cbbeccd:0:008302bc-c5ba-41be-925b-8567166246e4.pagedata:0:2346
				322e173fac914ce59df9db85a533b6eb65d9e0e8807d07ca57f9c6e18b76af29:0:008302bc-c5ba-41be-925b-8567166246e4.pdf:0:3053046
			`.trim().replace(/\t/g, '')

			const hashEntries = HashEntriesFactory.fromPayload(hashEntriesPayload)

			expect(hashEntries).toBeInstanceOf(V3HashEntries)
			expect(hashEntries.schemaVersion).toBe(3)
		})

		it('given an unsupported hash entries payload, throws an UnsupportedHashEntriesPayloadError', () => {
			const payload = 'unsupported payload'

			expect(() => {
				HashEntriesFactory.fromPayload(payload)
			}).toThrow(UnsupportedHashEntriesPayloadError)
		})
	})
})
