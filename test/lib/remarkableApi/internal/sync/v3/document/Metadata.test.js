import {expect, jest} from '@jest/globals'
import {mockFileMetadataUpdateRequest} from '../../../../../../helpers/remarkableApiHelper.js'
import {FetchBasedHttpClient} from '../../../../../../../src/lib/utils/httpClient'
import * as Schemas from '../../../../../../../src/lib/remarkableApi/internal/schemas'
import * as Sync from '../../../../../../../src/lib/remarkableApi/internal/sync'

describe('Metadata', () => {
	const session = global.remarkableApiSession
	const pdfFileRootHashEntry = Schemas.HashEntryFactory.fromPayload(global.pdfRootHashEntryPayload)
	const pdfMetadata = new Sync.V3.Document.Metadata(pdfFileRootHashEntry, global.pdfMetadata)

	describe('#pdfFileHashEntry', () => {
		it('returns the document root hash entry', () => {
			expect(pdfMetadata.rootHashEntry).toBe(pdfFileRootHashEntry)
		})
	})

	describe('#payload', () => {
		it('returns the metadata payload of the document', () => {
			expect(pdfMetadata.payload).toEqual(global.pdfMetadata)
		})
	})

	describe('#documentName', () => {
		it('returns document name', () => {
			expect(pdfMetadata.documentName).toBe('PDF Document.pdf')
		})
	})

	describe('#folderId', () => {
		it('returns unique UUID of the document containing the document', () => {
			expect(pdfMetadata.folderId).toBe('a80ce266-2974-491c-86b6-670453fd0b51')
		})
	})

	describe('#update', () => {
		it('updates document metadata against the reMarkable API', async () => {
			const expectedPdfMetadataPayload = JSON.stringify({ ...global.pdfMetadata, "visibleName": "Updated-File.pdf" })
			const expectedRequestBuffer = new Sync.V3.RequestBuffer(expectedPdfMetadataPayload)
			const expectedPdfMetadataHash = await expectedRequestBuffer.checksum()

			const fetchBasedHttpClientPutMock = jest.fn()
			await mockFileMetadataUpdateRequest(
				pdfFileRootHashEntry,
				expectedPdfMetadataPayload,
				fetchBasedHttpClientPutMock
			)
			FetchBasedHttpClient.put = fetchBasedHttpClientPutMock

			const newPdfMetadataHasEntry = await pdfMetadata.update({ visibleName: 'Updated-File.pdf' }, session)

			expect(newPdfMetadataHasEntry.fileId).toBe(pdfFileRootHashEntry.fileId)
			expect(newPdfMetadataHasEntry.sizeInBytes).toBe(expectedRequestBuffer.sizeInBytes)
			expect(newPdfMetadataHasEntry.fileExtension).toBe('metadata')
			expect(newPdfMetadataHasEntry.checksum).toBe(expectedPdfMetadataHash)
		})
	})
})