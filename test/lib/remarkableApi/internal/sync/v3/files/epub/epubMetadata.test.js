import {expect, jest} from '@jest/globals'
import {CONFIGURATION} from '../../../../../../../../src/lib/remarkableApi'
import {FetchBasedHttpClient} from '../../../../../../../../src/lib/utils/httpClient'
import * as Sync from '../../../../../../../../src/lib/remarkableApi/internal/sync'
import * as Schemas from '../../../../../../../../src/lib/remarkableApi/internal/schemas'

describe('EpubMetadata', () => {
	const session = global.remarkableApiSession
	const ePubHashEntry = Schemas.HashEntryFactory.fromPayload(global.ePubRootHashEntryPayload)
	const ePubMetadata = new Sync.V3.EpubMetadata(ePubHashEntry, global.ePubMetadata)

	describe('#epubFileRootHashEntry', () => {
		it('returns the e-Pub file root hash entry', () => {
			expect(ePubMetadata.epubFileRootHashEntry).toBe(ePubHashEntry)
		})
	})

	describe('#payload', () => {
		it('returns the metadata payload of the e-Pub file', () => {
			expect(ePubMetadata.payload).toEqual(global.ePubMetadata)
		})
	})

	describe('#fileName', () => {
		it('returns e-Pub file name', () => {
			expect(ePubMetadata.fileName).toBe('ePub Document.epub')
		})
	})

	describe('#folderId', () => {
		it('returns unique UUID of the folder containing the PDF file', () => {
			expect(ePubMetadata.folderId).toBe('8d7b715b-b55e-4db0-95d2-876e5d6feef1')
		})
	})

	describe('#update', () => {
		it('updates ePub file metadata against the reMarkable API', async () => {
			const expectedEpubMetadataPayload = JSON.stringify({ ...global.ePubMetadata, "visibleName": "Updated-File.pdf" })
			const expectedRequestBuffer = new Sync.V3.RequestBuffer(expectedEpubMetadataPayload)
			const expectedEpubMetadataHash = await expectedRequestBuffer.checksum()

			FetchBasedHttpClient.put = jest.fn()
			FetchBasedHttpClient
				.put
				.mockImplementationOnce((...args) => {
					expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.files + expectedEpubMetadataHash)
					expect(args[1]).toEqual(expectedRequestBuffer.payload)
					expect(args[2]).toEqual({
						'authorization': `Bearer ${session.token}`,
						'content-type': 'application/octet-stream',
						'rm-filename': `${ePubHashEntry.fileId}.metadata`,
						'rm-parent-hash': ePubHashEntry.checksum,
						'x-goog-hash': `crc32c=${expectedRequestBuffer.crc32Hash}`,
					})

					return Promise.resolve({ok: true, status: 200, json: () => Promise.resolve({})})
				})

			const newEpubMetadataHasEntry = await ePubMetadata.update({ visibleName: 'Updated-File.pdf' }, session)

			expect(newEpubMetadataHasEntry.fileId).toBe(ePubHashEntry.fileId)
			expect(newEpubMetadataHasEntry.sizeInBytes).toBe(expectedRequestBuffer.sizeInBytes)
			expect(newEpubMetadataHasEntry.fileExtension).toBe('metadata')
			expect(newEpubMetadataHasEntry.checksum).toBe(expectedEpubMetadataHash)
		})
	})
})