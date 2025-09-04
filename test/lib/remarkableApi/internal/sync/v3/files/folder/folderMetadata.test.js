import {expect, jest} from '@jest/globals'
import {CONFIGURATION} from '../../../../../../../../src/lib/remarkableApi'
import {FetchBasedHttpClient} from '../../../../../../../../src/lib/utils/httpClient'
import * as Schemas from '../../../../../../../../src/lib/remarkableApi/internal/schemas'
import * as Sync from '../../../../../../../../src/lib/remarkableApi/internal/sync'

describe('FolderMetadata', () => {
	const session = global.remarkableApiSession
	const folderRootHashEntry = Schemas.HashEntryFactory.fromPayload(global.folderRootHashEntryPayload)
	const folderMetadata = new Sync.V3.FolderMetadata(folderRootHashEntry, global.folderMetadata)

	describe('#folderRootHashEntry', () => {
		it('returns the folder root hash entry', () => {
			expect(folderMetadata.folderRootHashEntry).toBe(folderRootHashEntry)
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

			FetchBasedHttpClient.put = jest.fn()
			FetchBasedHttpClient
				.put
				.mockImplementationOnce((...args) => {
					expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.files + expectedFolderMetadataHash)
					expect(args[1]).toEqual(expectedRequestBuffer.payload)
					expect(args[2]).toEqual({
						'authorization': `Bearer ${session.token}`,
						'content-type': 'application/octet-stream',
						'rm-filename': `${folderRootHashEntry.fileId}.metadata`,
						'rm-parent-hash': folderRootHashEntry.checksum,
						'x-goog-hash': `crc32c=${expectedRequestBuffer.crc32Hash}`
					})

					return Promise.resolve({ok: true, status: 200, json: () => Promise.resolve({})})
				})

			const newFolderMetadataHasEntry = await folderMetadata.update({ visibleName: 'Updated Folder' }, session)

			expect(newFolderMetadataHasEntry.fileId).toBe(folderRootHashEntry.fileId)
			expect(newFolderMetadataHasEntry.sizeInBytes).toBe(expectedRequestBuffer.sizeInBytes)
			expect(newFolderMetadataHasEntry.fileExtension).toBe('metadata')
			expect(newFolderMetadataHasEntry.checksum).toBe(expectedFolderMetadataHash)
		})
	})
})