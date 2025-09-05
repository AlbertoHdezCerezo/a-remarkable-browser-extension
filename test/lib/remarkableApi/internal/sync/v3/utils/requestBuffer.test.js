import {RequestBuffer} from '../../../../../../../src/lib/remarkableApi/internal/sync/v3/utils'

describe('RequestBuffer', () => {
	describe('payloadUint8Array', () => {
		it('returns buffer payload as Uint8Array', () => {
			const payloadUint8Array = new RequestBuffer('test').payloadUint8Array

			expect(payloadUint8Array).toEqual(new Uint8Array([116, 101, 115, 116]))
		})
	})

	describe('#sizeInBytes', () => {
		it('returns buffer payload size in bytes', () => {
			const sizeInBytes = new RequestBuffer('test').sizeInBytes

			expect(sizeInBytes).toBe(4)
		})
	})

	describe('#checksum', () => {
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
			const hash = await new RequestBuffer(sample_payload).checksum()

			expect(hash).toBe('b28c94b2195c8ed259f0b415aaee3f39b0b2920a4537611499fa044956917a21')
		})
	})

	describe('#crc32', () => {
		it('returns buffer payload CRC32 checksum', () => {
			const crc32Hash = new RequestBuffer('test').crc32Hash

			expect(crc32Hash).toBe('hqBywA==')
		})
	})
})