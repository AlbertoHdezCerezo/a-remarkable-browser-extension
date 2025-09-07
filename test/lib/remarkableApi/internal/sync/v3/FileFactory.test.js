import {expect, jest} from '@jest/globals'
import {CONFIGURATION} from '../../../../../../src/lib/remarkableApi'
import {FetchBasedHttpClient} from '../../../../../../src/lib/utils/httpClient'
import * as Sync from '../../../../../../src/lib/remarkableApi/internal/sync'
import * as Schemas from '../../../../../../src/lib/remarkableApi/internal/schemas'

describe('FileFactory', () => {
	const root = global.root
	const session = global.remarkableApiSession

	describe('.fileFromHashEntries', () => {
		it('if given a PDF file hash entries, returns a PdfFile instance', async () => {
			FetchBasedHttpClient.get = jest.fn()
			FetchBasedHttpClient
				.get
				.mockImplementationOnce((...args) => {
					expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.files + global.pdfMetadataChecksum)
					expect(args[1]).toEqual({'Authorization': `Bearer ${session.token}`})

					return Promise.resolve({ok: true, status: 200, text: () => Promise.resolve(global.pdfMetadata)})
				})

			const pdfHashEntry = Schemas.HashEntryFactory.fromPayload(global.pdfRootHashEntryPayload)
			const pdfHashEntries = Schemas.HashEntriesFactory.fromPayload(global.pdfHashEntriesPayload)

			const pdfFile = await Sync.FileFactory.fileFromHashEntries(root, pdfHashEntry, pdfHashEntries, session)
			expect(pdfFile).toBeInstanceOf(Sync.V3.Document)
		})

		it('if given an EPUB file hash entries, returns an EpubFile instance', async () => {
			FetchBasedHttpClient.get = jest.fn()
			FetchBasedHttpClient
				.get
				.mockImplementationOnce((...args) => {
					expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.files + global.ePubMetadataChecksum)
					expect(args[1]).toEqual({'Authorization': `Bearer ${session.token}`})

					return Promise.resolve({ok: true, status: 200, text: () => Promise.resolve(global.ePubMetadata)})
				})

			const ePubHashEntry = Schemas.HashEntryFactory.fromPayload(global.ePubRootHashEntryPayload)
			const ePubHashEntries = Schemas.HashEntriesFactory.fromPayload(global.ePubHashEntriesPayload)

			const epubFile = await Sync.FileFactory.fileFromHashEntries(root, ePubHashEntry, ePubHashEntries, session)
			expect(epubFile).toBeInstanceOf(Sync.V3.Document)
		})

		it('if given a folder hash entries, returns a Folder instance', async () => {
			FetchBasedHttpClient.get = jest.fn()
			FetchBasedHttpClient
				.get
				.mockImplementationOnce((...args) => {
					expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.files + global.folderMetadataChecksum)
					expect(args[1]).toEqual({'Authorization': `Bearer ${session.token}`})

					return Promise.resolve({ok: true, status: 200, text: () => Promise.resolve(global.folderMetadata)})
				})

			const folderHashEntry = Schemas.HashEntryFactory.fromPayload(global.folderRootHashEntryPayload)
			const folderHashEntries = Schemas.HashEntriesFactory.fromPayload(global.folderHashEntriesPayload)

			const folderFile = await Sync.FileFactory.fileFromHashEntries(root, folderHashEntry, folderHashEntries, session)
			expect(folderFile).toBeInstanceOf(Sync.V3.Folder)
		})
	})
})