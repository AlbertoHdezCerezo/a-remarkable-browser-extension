import * as Schemas from '../../../../../src/lib/remarkableApi/internal/schemas'

describe('HashEntryFactory', () => {
	describe('.fromPayload', () => {
		it('given a v4 hash entry payload, returns a v4 hash entry instance', () => {
			const hashEntriesPayload = `
				cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531
			`

			const hashEntries = Schemas.HashEntryFactory.fromPayload(hashEntriesPayload)

			expect(hashEntries).toBeInstanceOf(Schemas.V4.HashEntry)
		})

		it('given an unsupported hash entries payload, throws an UnsupportedHashEntriesPayloadError', () => {
			const payload = 'unsupported payload'

			expect(() => {
				Schemas.HashEntryFactory.fromPayload(payload)
			}).toThrow(Schemas.V4.IncompatibleHashEntrySchemaError)
		})
	})
})
