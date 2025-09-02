import {expect, jest} from '@jest/globals'
import {CONFIGURATION} from '../../../../../../../../src/lib/remarkableApi'
import {RequestBuffer} from '../../../../../../../../src/lib/remarkableApi/internal/sync/v3/utils'
import {FetchBasedHttpClient} from '../../../../../../../../src/lib/utils/httpClient'
import * as Schemas from '../../../../../../../../src/lib/remarkableApi/internal/schemas'
import * as Sync from '../../../../../../../../src/lib/remarkableApi/internal/sync'

describe('PdfMetadata', () => {
	const pdfFileRootHashEntry = new Schemas.V4.HashEntry('e8e5d89278eebfded00982a272393d62fbd7fab1d9b4fc99b001f6ba342260c2:0:00f9663d-3d4a-4640-a755-3a0e66b44f1d:4:3943357')

	const pdfMetadataPayload = {
		"createdTime": "0",
		"lastModified": "1702268352386",
		"lastOpened": "1702267131426",
		"lastOpenedPage": 206,
		"parent": "81213c35-e5a9-4b39-9813-452ccb394dcd",
		"pinned": false,
		"type": "DocumentType",
		"visibleName": "File-Name.pdf"
	}

	const pdfMetadata = new Sync.V3.PdfMetadata(pdfFileRootHashEntry, pdfMetadataPayload)

	describe('#pdfFileHashEntry', () => {
		it('returns the PDF file root hash entry', () => {
			expect(pdfMetadata.pdfFileHashEntry).toBe(pdfFileRootHashEntry)
		})
	})

	describe('#payload', () => {
		it('returns the metadata payload of the PDF file', () => {
			expect(pdfMetadata.payload).toEqual(pdfMetadataPayload)
		})
	})

	describe('#fileName', () => {
		it('returns PDF file name', () => {
			expect(pdfMetadata.fileName).toBe('File-Name.pdf')
		})
	})

	describe('#folderId', () => {
		it('returns unique UUID of the folder containing the PDF file', () => {
			expect(pdfMetadata.folderId).toBe('81213c35-e5a9-4b39-9813-452ccb394dcd')
		})
	})

	describe('#update', () => {
		it('updates PDF file metadata against the reMarkable API', async () => {
			const session = global.remarkableApiSession
			const pdfFileRootHashEntry = new Schemas.V4.HashEntry('3ca0a5c6320ea93d185aa04e5ed1bae1469bdb06b6eb97adb59ee7ab8c86fb58:0:d4da3a60-8afb-4db6-82b4-de9154c26355.metadata:0:300')
			const pdfMetadataPayload = {
				"createdTime": "1732308492654",
				"lastModified": "1740911801443",
				"lastOpened": "1732369981529",
				"lastOpenedPage": 55,
				"parent": "trash",
				"pinned": false,
				"type": "DocumentType",
				"visibleName": "Test-File.pdf"
			}
			const pdfMetadata = new Sync.V3.PdfMetadata(pdfFileRootHashEntry, pdfMetadataPayload)
			const expectedPdfMetadataPayload = JSON.stringify({ ...pdfMetadataPayload, "visibleName": "Updated-File.pdf" })
			const expectedRequestBuffer = new RequestBuffer(expectedPdfMetadataPayload)
			const expectedPdfMetadataHash = await expectedRequestBuffer.checksum()

			FetchBasedHttpClient.put = jest.fn()
			FetchBasedHttpClient
				.put
				.mockImplementationOnce((...args) => {
					expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.files + expectedPdfMetadataHash)
					expect(args[1]).toEqual(expectedRequestBuffer.payload)
					expect(args[2]).toEqual({
						'authorization': `Bearer ${session.token}`,
						'content-type': 'application/octet-stream',
						'rm-filename': `${pdfFileRootHashEntry.fileId}.metadata`,
						'rm-parent-hash': pdfFileRootHashEntry.checksum,
						'x-goog-hash': `crc32c=${expectedRequestBuffer.crc32Hash}`
					})

					return Promise.resolve({ok: true, status: 200, json: () => Promise.resolve({})})
				})

			const newPdfMetadataHasEntry = await pdfMetadata.update({ visibleName: 'Updated-File.pdf' }, session)

			expect(newPdfMetadataHasEntry.fileId).toBe('d4da3a60-8afb-4db6-82b4-de9154c26355')
			expect(newPdfMetadataHasEntry.sizeInBytes).toBe(expectedRequestBuffer.sizeInBytes)
			expect(newPdfMetadataHasEntry.fileExtension).toBe('metadata')
			expect(newPdfMetadataHasEntry.checksum).toBe(expectedPdfMetadataHash)
		})
	})
})