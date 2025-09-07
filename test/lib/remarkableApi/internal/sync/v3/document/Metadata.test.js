import {expect, jest} from '@jest/globals'
import {mockFileMetadataUpdateRequest} from '../../../../../../helpers/remarkableApiHelper.js'
import {FetchBasedHttpClient} from '../../../../../../../src/lib/utils/httpClient'
import * as Schemas from '../../../../../../../src/lib/remarkableApi/internal/schemas'
import * as Sync from '../../../../../../../src/lib/remarkableApi/internal/sync'

describe('Metadata', () => {
	const session = global.remarkableApiSession
	const pdfFileRootHashEntry = Schemas.HashEntryFactory.fromPayload(global.pdfRootHashEntryPayload)
	const pdfMetadata = new Sync.V3.DocumentMetadata(pdfFileRootHashEntry, global.pdfMetadata)

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

	describe('#serialize', () => {
		it('coerces document metadata instance to a JSON stringified representation of it', () => {
			const serializedPdfMetadata = global.pdfFile.metadata.serialize()

			const parsedSerializedPdfMetadata = JSON.parse(serializedPdfMetadata)

			expect(parsedSerializedPdfMetadata.rootHashEntry).toBe(global.pdfFile.metadata.rootHashEntry.payload)
			expect(parsedSerializedPdfMetadata.payload).toEqual(global.pdfFile.metadata.payload)
		})
	})

	describe('.deserialize', () => {
		it('coerces string representing a serialized document metadata to a document metadata instance', () => {
			const expectedMetadata = global.pdfFile.metadata

			const serializedPdfMetadata = global.pdfFile.metadata.serialize()

			const deserializedPdfMetadata = Sync.V3.DocumentMetadata.deserialize(serializedPdfMetadata)

			expect(deserializedPdfMetadata.rootHashEntry.payload).toBe(expectedMetadata.rootHashEntry.payload)
			expect(deserializedPdfMetadata.payload).toEqual(expectedMetadata.payload)
		})
	})
})
