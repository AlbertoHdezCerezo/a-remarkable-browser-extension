import RequestBuffer from '../../../../../../src/lib/remarkableApi/internal/sync/v3/utils/requestBuffer'
import {HashEntry} from '../../../../../../src/lib/remarkableApi/internal/schemas/v3/hashEntry'
import {
	HashEntries, IncompatibleHashEntriesSchemaError,
	IncompatibleSchemaVersionError, MissingHashEntryForReplacementError
} from '../../../../../../src/lib/remarkableApi/internal/schemas/v3/hashEntries'

describe('HashEntries', () => {
	describe('.construct', () => {
		it('extracts content from file hash entries payload', () => {
			const hashEntriesPayload = `
				3
				1331300e9e5943c31e24d59cb746e5e8fdf81397b88409b5448f6e7409079ca4:0:90d8edb1-7c90-41ad-860b-b20faa2177d1.content:0:857
				418a222014d5ca77590537e87a0718dd412c5dadeeb0678fa615389630ce21a1:0:90d8edb1-7c90-41ad-860b-b20faa2177d1.metadata:0:236
				cd19cd35910562796b53dc066cb390d4df009d9e545fd487bba4705c3fb8057a:0:90d8edb1-7c90-41ad-860b-b20faa2177d1.pagedata:0:18
				3b42607786f14b90d3486eb325c98578283be42b74dabd63cf07efa3eaf10ec6:0:90d8edb1-7c90-41ad-860b-b20faa2177d1.pdf:0:28368
			`.trim().replace(/\t/g, '')

			const hashEntries = new HashEntries(hashEntriesPayload)

			expect(hashEntries.payload).toBe(hashEntriesPayload)
			expect(hashEntries.schemaVersion).toBe(3)
			expect(hashEntries.fileId).toBe('90d8edb1-7c90-41ad-860b-b20faa2177d1')
			expect(hashEntries.nestedHashEntriesCount).toBe(4)
			expect(hashEntries.sizeInBytes).toBe(29479)
			expect(hashEntries.hashEntriesList.length).toBe(4)
			expect(hashEntries.hashEntriesList[0].payload)
				.toBe('1331300e9e5943c31e24d59cb746e5e8fdf81397b88409b5448f6e7409079ca4:0:90d8edb1-7c90-41ad-860b-b20faa2177d1.content:0:857')
		})

		it('extracts content from root hash entries payload', () => {
			const hashEntriesPayload = `
				3
				1331300e9e5943c31e24d59cb746e5e8fdf81397b88409b5448f6e7409079ca4:0:90d8edb1-7c90-41ad-860b-b20faa2177d1:0:857
				418a222014d5ca77590537e87a0718dd412c5dadeeb0678fa615389630ce21a1:0:90d8edb1-7c90-41ad-860b-b20faa2177d1:0:236
				cd19cd35910562796b53dc066cb390d4df009d9e545fd487bba4705c3fb8057a:0:90d8edb1-7c90-41ad-860b-b20faa2177d1:0:18
				3b42607786f14b90d3486eb325c98578283be42b74dabd63cf07efa3eaf10ec6:0:90d8edb1-7c90-41ad-860b-b20faa2177d1:0:28368
			`.trim().replace(/\t/g, '')

			const hashEntries = new HashEntries(hashEntriesPayload)

			expect(hashEntries.payload).toBe(hashEntriesPayload)
			expect(hashEntries.schemaVersion).toBe(3)
			expect(hashEntries.fileId).toBe('90d8edb1-7c90-41ad-860b-b20faa2177d1')
			expect(hashEntries.nestedHashEntriesCount).toBe(4)
			expect(hashEntries.sizeInBytes).toBe(29479)
			expect(hashEntries.hashEntriesList.length).toBe(4)
			expect(hashEntries.hashEntriesList[0].payload)
				.toBe('1331300e9e5943c31e24d59cb746e5e8fdf81397b88409b5448f6e7409079ca4:0:90d8edb1-7c90-41ad-860b-b20faa2177d1:0:857')
		})

		it('if payload corresponds to a schema version other than 4, throws an error', () => {
			const hashEntriesPayload = `
				4
				0:008302bc-c5ba-41be-925b-8567166246e4:5:5665759
				cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531
			`.trim().replace(/\t/g, '')

			try { new HashEntries(hashEntriesPayload) } catch (error) {
				expect(error).toBeInstanceOf(IncompatibleSchemaVersionError)
			}
		})

		it('if payload does not match the expected format, throws an error', () => {
			const hashEntriesPayload = `
				3
			`.trim().replace(/\t/g, '')

			try { new HashEntries(hashEntriesPayload) } catch (error) {
				expect(error).toBeInstanceOf(Error)
			}
		})
	})

	describe('#rootHashEntries', () => {
		it('if given root hash entries, returns true', () => {
			const hashEntriesPayload = `
				3
				883411c7fa93637f63ada401b9fbe06eda8d16363f946dc7f296a05c3b3ba91d:0:008302bc-c5ba-41be-925b-8567166246e4:5:5665759
			`.trim().replace(/\t/g, '')

			const hashEntries = new HashEntries(hashEntriesPayload)

			expect(hashEntries.rootHashEntries).toBe(true)
		})

		it('if given non-root hash entries, returns false', () => {
			const hashEntriesPayload = `
				3
				cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531
			`.trim().replace(/\t/g, '')

			const hashEntries = new HashEntries(hashEntriesPayload)

			expect(hashEntries.rootHashEntries).toBe(false)
		})
	})

	describe('#resemblesAFolder', () => {
		it('if entries contain no page data entry, returns true', () => {
			const hashEntriesPayload = `
				3
				cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531
				cf0603f27e347959822926d78430c77e4264f014a9c816fe33029befb4a80f12:0:008302bc-c5ba-41be-925b-8567166246e4.epub:0:2583509
			`.trim().replace(/\t/g, '')

			const hashEntries = new HashEntries(hashEntriesPayload)

			expect(hashEntries.resemblesAFolder).toBe(true)
		})
	})

	describe('#resemblesAPdf', () => {
		it('if entries contain pdf entry, and no ePub entry, returns true', () => {
			const hashEntriesPayload = `
				3
				cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531
				322e173fac914ce59df9db85a533b6eb65d9e0e8807d07ca57f9c6e18b76af29:0:008302bc-c5ba-41be-925b-8567166246e4.pdf:0:3053046
			`.trim().replace(/\t/g, '')

			const hashEntries = new HashEntries(hashEntriesPayload)

			expect(hashEntries.resemblesAFolder).toBe(true)
		})

		it('if entries does not contain pdf entry, returns false', () => {
			const hashEntriesPayload = `
				3
				cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531
				cf0603f27e347959822926d78430c77e4264f014a9c816fe33029befb4a80f12:0:008302bc-c5ba-41be-925b-8567166246e4.epub:0:2583509
			`.trim().replace(/\t/g, '')

			const hashEntries = new HashEntries(hashEntriesPayload)

			expect(hashEntries.resemblesAPdf).toBe(false)
		})

		it('if entries contains pdf and ePub entries, returns false', () => {
			const hashEntriesPayload = `
				3
				cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531
				cf0603f27e347959822926d78430c77e4264f014a9c816fe33029befb4a80f12:0:008302bc-c5ba-41be-925b-8567166246e4.epub:0:2583509
				322e173fac914ce59df9db85a533b6eb65d9e0e8807d07ca57f9c6e18b76af29:0:008302bc-c5ba-41be-925b-8567166246e4.pdf:0:3053046
			`.trim().replace(/\t/g, '')

			const hashEntries = new HashEntries(hashEntriesPayload)

			expect(hashEntries.resemblesAPdf).toBe(false)
		})
	})

	describe('#resemblesAnEpub', () => {
		it('if entries contain ePub entry, returns true', () => {
			const hashEntriesPayload = `
				3
				cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531
				cf0603f27e347959822926d78430c77e4264f014a9c816fe33029befb4a80f12:0:008302bc-c5ba-41be-925b-8567166246e4.epub:0:2583509
				69ae298325a1a1d3f2dc4f6d6daa1db9b52ac523a1c455f19de4348184ce53e6:0:008302bc-c5ba-41be-925b-8567166246e4.pdf:0:327
			`.trim().replace(/\t/g, '')

			const hashEntries = new HashEntries(hashEntriesPayload)

			expect(hashEntries.resemblesAnEpub).toBe(true)
		})

		it('if entries does not contain ePub entry, returns false', () => {
			const hashEntriesPayload = `
				3
				cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531
				322e173fac914ce59df9db85a533b6eb65d9e0e8807d07ca57f9c6e18b76af29:0:008302bc-c5ba-41be-925b-8567166246e4.pdf:0:3053046
			`.trim().replace(/\t/g, '')

			const hashEntries = new HashEntries(hashEntriesPayload)

			expect(hashEntries.resemblesAnEpub).toBe(false)
		})
	})

	describe('#sizeInBytesFromHashEntries', () => {
		it('returns total size in bytes of all hash entries', () => {
			const hashEntriesPayload = `
				3
				cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531
				cf0603f27e347959822926d78430c77e4264f014a9c816fe33029befb4a80f12:0:008302bc-c5ba-41be-925b-8567166246e4.epub:0:2583509
				69ae298325a1a1d3f2dc4f6d6daa1db9b52ac523a1c455f19de4348184ce53e6:0:008302bc-c5ba-41be-925b-8567166246e4.metadata:0:327
				63fdd266a9e733b0807f9e884e3d7c0e76cbe3100f72bef4f67865172cbbeccd:0:008302bc-c5ba-41be-925b-8567166246e4.pagedata:0:2346
				322e173fac914ce59df9db85a533b6eb65d9e0e8807d07ca57f9c6e18b76af29:0:008302bc-c5ba-41be-925b-8567166246e4.pdf:0:3053046
			`.trim().replace(/\t/g, '')

			const hashEntries = new HashEntries(hashEntriesPayload)

			expect(hashEntries.sizeInBytesFromHashEntries).toBe(26531 + 2583509 + 327 + 2346 + 3053046)
		})
	})

	describe('#hashEntry', () => {
		it('returns hash entry from the hash entries information', async () => {
			const hashEntriesPayload = `
				3
				cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531
				cf0603f27e347959822926d78430c77e4264f014a9c816fe33029befb4a80f12:0:008302bc-c5ba-41be-925b-8567166246e4.epub:0:2583509
				69ae298325a1a1d3f2dc4f6d6daa1db9b52ac523a1c455f19de4348184ce53e6:0:008302bc-c5ba-41be-925b-8567166246e4.metadata:0:327
				63fdd266a9e733b0807f9e884e3d7c0e76cbe3100f72bef4f67865172cbbeccd:0:008302bc-c5ba-41be-925b-8567166246e4.pagedata:0:2346
				322e173fac914ce59df9db85a533b6eb65d9e0e8807d07ca57f9c6e18b76af29:0:008302bc-c5ba-41be-925b-8567166246e4.pdf:0:3053046
			`.trim().replace(/\t/g, '')

			const hashEntries = new HashEntries(hashEntriesPayload)

			const hashEntry = await hashEntries.hashEntry()

			expect(hashEntry).toBeInstanceOf(HashEntry)
			expect(hashEntry.payload).toBe('1f08cb74bb994a496a635f2d7e816025041ca7495beb7241bb9e9bcae6861360:0:008302bc-c5ba-41be-925b-8567166246e4:5:5665759')
		})
	})

	describe('#replace', () => {
		it('given a hash entry in hash entries list,' +
				'returns new hash entries with given hash replaced by new hash', () => {
			const hashEntriesPayload = `
				3
				cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531
				cf0603f27e347959822926d78430c77e4264f014a9c816fe33029befb4a80f12:0:008302bc-c5ba-41be-925b-8567166246e4.epub:0:2583509
				69ae298325a1a1d3f2dc4f6d6daa1db9b52ac523a1c455f19de4348184ce53e6:0:008302bc-c5ba-41be-925b-8567166246e4.metadata:0:327
				63fdd266a9e733b0807f9e884e3d7c0e76cbe3100f72bef4f67865172cbbeccd:0:008302bc-c5ba-41be-925b-8567166246e4.pagedata:0:2346
				322e173fac914ce59df9db85a533b6eb65d9e0e8807d07ca57f9c6e18b76af29:0:008302bc-c5ba-41be-925b-8567166246e4.pdf:0:3053046
			`.trim().replace(/\t/g, '')

			const expectedHashEntriesPayload = `
				3
				452696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26530
				cf0603f27e347959822926d78430c77e4264f014a9c816fe33029befb4a80f12:0:008302bc-c5ba-41be-925b-8567166246e4.epub:0:2583509
				69ae298325a1a1d3f2dc4f6d6daa1db9b52ac523a1c455f19de4348184ce53e6:0:008302bc-c5ba-41be-925b-8567166246e4.metadata:0:327
				63fdd266a9e733b0807f9e884e3d7c0e76cbe3100f72bef4f67865172cbbeccd:0:008302bc-c5ba-41be-925b-8567166246e4.pagedata:0:2346
				322e173fac914ce59df9db85a533b6eb65d9e0e8807d07ca57f9c6e18b76af29:0:008302bc-c5ba-41be-925b-8567166246e4.pdf:0:3053046
			`.trim().replace(/\t/g, '')

			const hashEntries = new HashEntries(hashEntriesPayload)

			const currentHashEntry = hashEntries.hashEntriesList[0]
			const newHashEntry = new HashEntry(expectedHashEntriesPayload.split('\n')[1])

			const newHashEntries = hashEntries.replace(currentHashEntry, newHashEntry)

			expect(newHashEntries.payload).toBe(expectedHashEntriesPayload)
		})

		it('if given hash entry to replace is not in hash entries list, throws an error', () => {
			const hashEntriesPayload = `
				3
				cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531
				cf0603f27e347959822926d78430c77e4264f014a9c816fe33029befb4a80f12:0:008302bc-c5ba-41be-925b-8567166246e4.epub:0:2583509
				69ae298325a1a1d3f2dc4f6d6daa1db9b52ac523a1c455f19de4348184ce53e6:0:008302bc-c5ba-41be-925b-8567166246e4.metadata:0:327
				63fdd266a9e733b0807f9e884e3d7c0e76cbe3100f72bef4f67865172cbbeccd:0:008302bc-c5ba-41be-925b-8567166246e4.pagedata:0:2346
				322e173fac914ce59df9db85a533b6eb65d9e0e8807d07ca57f9c6e18b76af29:0:008302bc-c5ba-41be-925b-8567166246e4.pdf:0:3053046
			`.trim().replace(/\t/g, '')

			const hashEntries = new HashEntries(hashEntriesPayload)

			const currentHashEntry = new HashEntry('thisisnotanexistinghashentry:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531')

			try {
				hashEntries.replace(currentHashEntry, new HashEntry('newhashentry:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531'))
			} catch (error) {
				expect(error).toBeInstanceOf(MissingHashEntryForReplacementError)
			}
		})
	})

	describe('#asRequestBuffer', () => {
		it('returns a buffer representation of the hash entries payload', () => {
			const hashEntriesPayload = `
				3
				cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531
				cf0603f27e347959822926d78430c77e4264f014a9c816fe33029befb4a80f12:0:008302bc-c5ba-41be-925b-8567166246e4.epub:0:2583509
				69ae298325a1a1d3f2dc4f6d6daa1db9b52ac523a1c455f19de4348184ce53e6:0:008302bc-c5ba-41be-925b-8567166246e4.metadata:0:327
				63fdd266a9e733b0807f9e884e3d7c0e76cbe3100f72bef4f67865172cbbeccd:0:008302bc-c5ba-41be-925b-8567166246e4.pagedata:0:2346
				322e173fac914ce59df9db85a533b6eb65d9e0e8807d07ca57f9c6e18b76af29:0:008302bc-c5ba-41be-925b-8567166246e4.pdf:0:3053046
			`.trim().replace(/\t/g, '')

			const hashEntries = new HashEntries(hashEntriesPayload)

			expect(hashEntries.asRequestBuffer()).toBeInstanceOf(RequestBuffer)
			expect(hashEntries.asRequestBuffer().payload).toBe(hashEntriesPayload)
		})
	})

	describe('#checksum', () => {
		it('returns the SHA-256 checksum of the hash entries payload', async () => {
			const hashEntriesPayload = `
				3
				cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531
				cf0603f27e347959822926d78430c77e4264f014a9c816fe33029befb4a80f12:0:008302bc-c5ba-41be-925b-8567166246e4.epub:0:2583509
				69ae298325a1a1d3f2dc4f6d6daa1db9b52ac523a1c455f19de4348184ce53e6:0:008302bc-c5ba-41be-925b-8567166246e4.metadata:0:327
				63fdd266a9e733b0807f9e884e3d7c0e76cbe3100f72bef4f67865172cbbeccd:0:008302bc-c5ba-41be-925b-8567166246e4.pagedata:0:2346
				322e173fac914ce59df9db85a533b6eb65d9e0e8807d07ca57f9c6e18b76af29:0:008302bc-c5ba-41be-925b-8567166246e4.pdf:0:3053046
			`.trim().replace(/\t/g, '')

			const hashEntries = new HashEntries(hashEntriesPayload)
			const hashEntriesChecksum = await hashEntries.checksum()

			expect(hashEntriesChecksum).toBe('1f08cb74bb994a496a635f2d7e816025041ca7495beb7241bb9e9bcae6861360')
		})
	})
})
