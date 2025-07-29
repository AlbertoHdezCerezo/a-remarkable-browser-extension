import RequestBuffer from '../../../../../../../src/lib/remarkableApi/internal/sync/v3/utils/requestBuffer'

describe('RequestBuffer', () => {
	describe('#hash', () => {
		const sample_payload = {
			"createdTime": "1752956004000",
			"deleted": false,
			"lastModified": "1753814831454",
			"lastOpened": "1753644840173",
			"lastOpenedPage": 0,
			"metadatamodified": false,
			"modified": false,
			"new": false,
			"parent": "",
			"pinned": false,
			"source": "",
			"synced": false,
			"type": "DocumentType",
			"version": 0,
			"visibleName": "Cacahue"
		}

		it('returns buffer payload checksum', async () => {
			const hash = await new RequestBuffer(sample_payload).hash()

			expect(hash).toBe('c6910c078adcff29c105865dc505cd933110337aaa5a41d4e056b227f216ad1c')
		})
	})

	describe('#crc32', () => {
		it('returns buffer payload CRC32 checksum', () => {
			const crc32Hash = new RequestBuffer('test').crc32Hash

			expect(crc32Hash).toBe('hqBywA==')
		})
	})
})