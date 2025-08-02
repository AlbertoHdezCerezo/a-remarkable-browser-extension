import HashEntries from '../../../../../../src/lib/remarkableApi/internal/schemas/v4/hashEntries.js'
import HashEntry from "../../../../../../src/lib/remarkableApi/internal/schemas/v4/hashEntry.js";

describe('HashEntries', () => {
	describe('.construct', () => {
		it('extracts content from hash entries payload', () => {
			const hashEntriesPayload = `
				4
				0:.:394:15968759023
				883411c7fa93637f63ada401b9fbe06eda8d16363f946dc7f296a05c3b3ba91d:0:008302bc-c5ba-41be-925b-8567166246e4:5:5665759
				e8e5d89278eebfded00982a272393d62fbd7fab1d9b4fc99b001f6ba342260c2:0:00f9663d-3d4a-4640-a755-3a0e66b44f1d:4:3943357
				5ade6b3c89f1483a3e770d0392e86e3593307e6d53b1e1f48cb66f9a116bdad2:0:04374835-5769-40a9-897e-88050f8f3501:4:107426982
				2c9a9e10984e55e0ba7206a189dba6f007dcd46122b92720d916ca551ee96ca9:0:05ad2707-750f-4a8c-9513-66aa2917a906:4:3684358
				a9cae2ec2359d092036248084c400fe3fcf73b06ecd080739db2434fa79447af:0:05d8aaa7-641a-4bd4-a21e-c359d8129ab6:4:57221792
				7a6c64d0d2a619eaab290e1a0d179af6ba11e2b5b4ae64c24c834d4af6d1a930:0:0608d996-dd20-4d19-970d-bc803fd91b78:4:17780398
			`.trim().replace(/\t/g, '')

			const hashEntries = new HashEntries(hashEntriesPayload)

			expect(hashEntries.payload).toBe(hashEntriesPayload)
			expect(hashEntries.schemaVersion).toBe(4)
			expect(hashEntries.fileId).toBe('.')
			expect(hashEntries.nestedHashEntriesCount).toBe(394)
			expect(hashEntries.sizeInBytes).toBe(15968759023)
			expect(hashEntries.hashEntriesList.length).toBe(6)
			expect(hashEntries.hashEntriesList[0].payload)
				.toBe('883411c7fa93637f63ada401b9fbe06eda8d16363f946dc7f296a05c3b3ba91d:0:008302bc-c5ba-41be-925b-8567166246e4:5:5665759')
		})

		it('extracts content from root hash entries payload', () => {
			const hashEntriesPayload = `
				4
				0:008302bc-c5ba-41be-925b-8567166246e4:5:5665759
				cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531
				cf0603f27e347959822926d78430c77e4264f014a9c816fe33029befb4a80f12:0:008302bc-c5ba-41be-925b-8567166246e4.epub:0:2583509
				69ae298325a1a1d3f2dc4f6d6daa1db9b52ac523a1c455f19de4348184ce53e6:0:008302bc-c5ba-41be-925b-8567166246e4.metadata:0:327
				63fdd266a9e733b0807f9e884e3d7c0e76cbe3100f72bef4f67865172cbbeccd:0:008302bc-c5ba-41be-925b-8567166246e4.pagedata:0:2346
				322e173fac914ce59df9db85a533b6eb65d9e0e8807d07ca57f9c6e18b76af29:0:008302bc-c5ba-41be-925b-8567166246e4.pdf:0:3053046
			`.trim().replace(/\t/g, '')

			const hashEntries = new HashEntries(hashEntriesPayload)

			expect(hashEntries.payload).toBe(hashEntriesPayload)
			expect(hashEntries.schemaVersion).toBe(4)
			expect(hashEntries.fileId).toBe('008302bc-c5ba-41be-925b-8567166246e4')
			expect(hashEntries.nestedHashEntriesCount).toBe(5)
			expect(hashEntries.sizeInBytes).toBe(5665759)
			expect(hashEntries.hashEntriesList.length).toBe(5)
			expect(hashEntries.hashEntriesList[0].payload)
				.toBe('cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531')
		})
	})

	describe('#rootHashEntries', () => {
		it('if given root hash entries, returns true', () => {
			const hashEntriesPayload = `
				4
				0:.:394:15968759023
				883411c7fa93637f63ada401b9fbe06eda8d16363f946dc7f296a05c3b3ba91d:0:008302bc-c5ba-41be-925b-8567166246e4:5:5665759
			`.trim().replace(/\t/g, '')

			const hashEntries = new HashEntries(hashEntriesPayload)

			expect(hashEntries.rootHashEntries).toBe(true)
		})

		it('if given non-root hash entries, returns false', () => {
			const hashEntriesPayload = `
				4
				0:008302bc-c5ba-41be-925b-8567166246e4:5:5665759
				cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531
			`.trim().replace(/\t/g, '')

			const hashEntries = new HashEntries(hashEntriesPayload)

			expect(hashEntries.rootHashEntries).toBe(false)
		})
	})

	describe('#resemblesAFolder', () => {
		it('if entries contain no page data entry, returns true', () => {
			const hashEntriesPayload = `
				4
				0:008302bc-c5ba-41be-925b-8567166246e4:5:5665759
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
				4
				0:008302bc-c5ba-41be-925b-8567166246e4:5:5665759
				cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531
				322e173fac914ce59df9db85a533b6eb65d9e0e8807d07ca57f9c6e18b76af29:0:008302bc-c5ba-41be-925b-8567166246e4.pdf:0:3053046
			`.trim().replace(/\t/g, '')

			const hashEntries = new HashEntries(hashEntriesPayload)

			expect(hashEntries.resemblesAFolder).toBe(true)
		})

		it('if entries does not contain pdf entry, returns false', () => {
			const hashEntriesPayload = `
				4
				0:008302bc-c5ba-41be-925b-8567166246e4:5:5665759
				cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531
				cf0603f27e347959822926d78430c77e4264f014a9c816fe33029befb4a80f12:0:008302bc-c5ba-41be-925b-8567166246e4.epub:0:2583509
			`.trim().replace(/\t/g, '')

			const hashEntries = new HashEntries(hashEntriesPayload)

			expect(hashEntries.resemblesAPdf).toBe(false)
		})

		it('if entries contains pdf and ePub entries, returns false', () => {
			const hashEntriesPayload = `
				4
				0:008302bc-c5ba-41be-925b-8567166246e4:5:5665759
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
				4
				0:008302bc-c5ba-41be-925b-8567166246e4:5:5665759
				cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531
				cf0603f27e347959822926d78430c77e4264f014a9c816fe33029befb4a80f12:0:008302bc-c5ba-41be-925b-8567166246e4.epub:0:2583509
				69ae298325a1a1d3f2dc4f6d6daa1db9b52ac523a1c455f19de4348184ce53e6:0:008302bc-c5ba-41be-925b-8567166246e4.pdf:0:327
			`.trim().replace(/\t/g, '')

			const hashEntries = new HashEntries(hashEntriesPayload)

			expect(hashEntries.resemblesAnEpub).toBe(true)
		})

		it('if entries does not contain ePub entry, returns false', () => {
			const hashEntriesPayload = `
				4
				0:008302bc-c5ba-41be-925b-8567166246e4:5:5665759
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
				4
				0:008302bc-c5ba-41be-925b-8567166246e4:5:5665759
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

	describe('#replace', () => {
		it('given a hash entry in hash entries list,' +
				'returns new hash entries with given hash replaced by new hash', () => {
			const hashEntriesPayload = `
				4
				0:008302bc-c5ba-41be-925b-8567166246e4:5:5665759
				cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531
				cf0603f27e347959822926d78430c77e4264f014a9c816fe33029befb4a80f12:0:008302bc-c5ba-41be-925b-8567166246e4.epub:0:2583509
				69ae298325a1a1d3f2dc4f6d6daa1db9b52ac523a1c455f19de4348184ce53e6:0:008302bc-c5ba-41be-925b-8567166246e4.metadata:0:327
				63fdd266a9e733b0807f9e884e3d7c0e76cbe3100f72bef4f67865172cbbeccd:0:008302bc-c5ba-41be-925b-8567166246e4.pagedata:0:2346
				322e173fac914ce59df9db85a533b6eb65d9e0e8807d07ca57f9c6e18b76af29:0:008302bc-c5ba-41be-925b-8567166246e4.pdf:0:3053046
			`.trim().replace(/\t/g, '')

			const hashEntries = new HashEntries(hashEntriesPayload)

			const currentHashEntry = hashEntries.hashEntriesList[2]

			const newHashEntry = new HashEntry('452696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531')

			const newHashEntries = hashEntries.replace(currentHashEntry, newHashEntry)

			expect(newHashEntries.payload)
				.toBe(hashEntriesPayload.replace(hashEntries.hashEntriesList[2].payload, newHashEntry.payload))
		})
	})
})