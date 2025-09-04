import {expect, jest} from '@jest/globals'
import {CONFIGURATION} from '../../../../../../../../src/lib/remarkableApi'
import {FetchBasedHttpClient} from '../../../../../../../../src/lib/utils/httpClient'
import * as Schemas from '../../../../../../../../src/lib/remarkableApi/internal/schemas'
import * as Sync from '../../../../../../../../src/lib/remarkableApi/internal/sync'

describe('PdfMetadata', () => {
	const session = global.remarkableApiSession
	const pdfFileRootHashEntry = Schemas.HashEntryFactory.fromPayload(global.pdfRootHashEntryPayload)
	const pdfMetadata = new Sync.V3.PdfMetadata(pdfFileRootHashEntry, global.pdfMetadata)

	describe('#pdfFileHashEntry', () => {
		it('returns the PDF file root hash entry', () => {
			expect(pdfMetadata.pdfFileHashEntry).toBe(pdfFileRootHashEntry)
		})
	})

	describe('#payload', () => {
		it('returns the metadata payload of the PDF file', () => {
			expect(pdfMetadata.payload).toEqual(global.pdfMetadata)
		})
	})

	describe('#fileName', () => {
		it('returns PDF file name', () => {
			expect(pdfMetadata.fileName).toBe('PDF Document.pdf')
		})
	})

	describe('#folderId', () => {
		it('returns unique UUID of the folder containing the PDF file', () => {
			expect(pdfMetadata.folderId).toBe('a80ce266-2974-491c-86b6-670453fd0b51')
		})
	})

	describe('#update', () => {
		it('updates PDF file metadata against the reMarkable API', async () => {
			const expectedPdfMetadataPayload = JSON.stringify({ ...global.pdfMetadata, "visibleName": "Updated-File.pdf" })
			const expectedRequestBuffer = new Sync.V3.RequestBuffer(expectedPdfMetadataPayload)
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

			expect(newPdfMetadataHasEntry.fileId).toBe(pdfFileRootHashEntry.fileId)
			expect(newPdfMetadataHasEntry.sizeInBytes).toBe(expectedRequestBuffer.sizeInBytes)
			expect(newPdfMetadataHasEntry.fileExtension).toBe('metadata')
			expect(newPdfMetadataHasEntry.checksum).toBe(expectedPdfMetadataHash)
		})
	})
})