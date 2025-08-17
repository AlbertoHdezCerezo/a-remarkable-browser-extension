import {setupHttpRecording} from '../../../../../../../helpers/pollyHelper'
import {HashEntry} from '../../../../../../../../src/lib/remarkableApi/internal/schemas/v4/hashEntry'
import RequestBuffer from '../../../../../../../../src/lib/remarkableApi/internal/sync/v3/utils/requestBuffer'
import Device from '../../../../../../../../src/lib/remarkableApi/internal/token/device.js'
import Session from '../../../../../../../../src/lib/remarkableApi/internal/token/session.js'
import FolderMetadata
	from '../../../../../../../../src/lib/remarkableApi/internal/sync/v3/files/folder/folderMetadata'
import {
	HashEntriesFactory,
	HashEntryFactory
} from "../../../../../../../../src/lib/remarkableApi/internal/schemas/index.js";

describe('FolderMetadata', () => {
	const folderRootHashEntry = HashEntryFactory.fromPayload(global.sampleFolderHashEntryPayload)

	const folderMetadataPayload = {
		"createdTime": "1733944931405",
		"lastModified": "1733944931404",
		"parent": "5100ea0c-cec8-4d2e-9833-d179ddfff95d",
		"pinned": false,
		"type": "CollectionType",
		"visibleName": "A folder name"
	}

	const folderMetadata = new FolderMetadata(folderRootHashEntry, folderMetadataPayload)

	describe('#folderRootHashEntry', () => {
		it('returns the PDF file root hash entry', () => {
			expect(folderMetadata.folderRootHashEntry).toBe(folderRootHashEntry)
		})
	})

	describe('#payload', () => {
		it('returns the metadata payload of the PDF file', () => {
			expect(folderMetadata.payload).toEqual(folderMetadataPayload)
		})
	})

	describe('#folderName', () => {
		it('returns folder name', () => {
			expect(folderMetadata.folderName).toBe(folderMetadataPayload.visibleName)
		})
	})

	describe('#folderId', () => {
		it('returns unique UUID of the folder containing the folder', () => {
			expect(folderMetadata.folderId).toBe(folderMetadataPayload.parent)
		})
	})

	describe('#update', () => {
		setupHttpRecording()

		it('updates folder metadata against the reMarkable API', async () => {
			const session = global.remarkableApiSession
			const folderRootHashEntry = HashEntriesFactory.fromPayload(global.sampleFolderHashEntryPayload)
			const folderMetadata = new FolderMetadata(folderRootHashEntry, folderMetadataPayload)
			const newFolderMetadataHasEntry = await folderMetadata.update({ visibleName: 'Updated Folder' }, session)
			const expectedFolderMetadataPayload = JSON.stringify({ ...folderMetadataPayload, "visibleName": "Updated Folder" })
			const expectedRequestBuffer = new RequestBuffer(expectedFolderMetadataPayload)
			const expectedFolderMetadataHash = await expectedRequestBuffer.checksum()

			expect(newFolderMetadataHasEntry.fileId).toBe(folderRootHashEntry.fileId)
			expect(newFolderMetadataHasEntry.sizeInBytes).toBe(expectedRequestBuffer.sizeInBytes)
			expect(newFolderMetadataHasEntry.fileExtension).toBe('metadata')
			expect(newFolderMetadataHasEntry.checksum).toBe(expectedFolderMetadataHash)

			const resultingFolderMetadata = await newFolderMetadataHasEntry.content(session)

			expect(resultingFolderMetadata.visibleName).toBe('Updated Folder')
		})
	})
})