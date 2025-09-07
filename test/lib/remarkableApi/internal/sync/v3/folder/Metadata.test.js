import {expect, jest} from '@jest/globals'
import {mockFileMetadataUpdateRequest} from '../../../../../../helpers/remarkableApiHelper'
import {FetchBasedHttpClient} from '../../../../../../../src/lib/utils/httpClient'
import * as Schemas from '../../../../../../../src/lib/remarkableApi/internal/schemas'
import * as Sync from '../../../../../../../src/lib/remarkableApi/internal/sync'

describe('Metadata', () => {
	const session = global.remarkableApiSession
	const folderRootHashEntry = Schemas.HashEntryFactory.fromPayload(global.folderRootHashEntryPayload)
	const folderMetadata = new Sync.V3.Folder.Metadata(folderRootHashEntry, global.folderMetadata)

	describe('#rootHashEntry', () => {
		it('returns the folder root hash entry', () => {
			expect(folderMetadata.rootHashEntry).toBe(folderRootHashEntry)
		})
	})

	describe('#payload', () => {
		it('returns the metadata payload of the folder', () => {
			expect(folderMetadata.payload).toEqual(global.folderMetadata)
		})
	})

	describe('#folderName', () => {
		it('returns folder name', () => {
			expect(folderMetadata.folderName).toBe(global.folderMetadata.visibleName)
		})
	})

	describe('#folderId', () => {
		it('returns unique UUID of the folder containing the folder', () => {
			expect(folderMetadata.folderId).toBe(global.folderMetadata.parent)
		})
	})

	describe('#update', () => {
		it('updates folder metadata against the reMarkable API', async () => {
			const expectedFolderMetadataPayload = JSON.stringify({ ...global.folderMetadata, "visibleName": "Updated Folder" })
			const expectedRequestBuffer = new Sync.V3.RequestBuffer(expectedFolderMetadataPayload)
			const expectedFolderMetadataHash = await expectedRequestBuffer.checksum()

			const fetchBasedHttpClientPutMock = jest.fn()
			await mockFileMetadataUpdateRequest(
				folderRootHashEntry,
				expectedFolderMetadataPayload,
				fetchBasedHttpClientPutMock
			)
			FetchBasedHttpClient.put = fetchBasedHttpClientPutMock

			const newFolderMetadataHasEntry = await folderMetadata.update({ visibleName: 'Updated Folder' }, session)

			expect(newFolderMetadataHasEntry.fileId).toBe(folderRootHashEntry.fileId)
			expect(newFolderMetadataHasEntry.sizeInBytes).toBe(expectedRequestBuffer.sizeInBytes)
			expect(newFolderMetadataHasEntry.fileExtension).toBe('metadata')
			expect(newFolderMetadataHasEntry.checksum).toBe(expectedFolderMetadataHash)
		})
	})
})