import {expect, jest} from '@jest/globals'
import {mockDocumentMetadataRequest, mockDocumentRequest} from '../../../../../helpers/remarkableApiHelper'
import {FetchBasedHttpClient} from '../../../../../../src/lib/utils/httpClient'
import * as Sync from '../../../../../../src/lib/remarkableApi/internal/sync'
import * as Schemas from '../../../../../../src/lib/remarkableApi/internal/schemas'

describe('FileFactory', () => {
	const session = global.remarkableApiSession

	describe('.fileFromHashEntry', () => {
		it('fetches file hash entries and fetches correspoinding File instance', async () => {
			const fetchBasedHttpClientGetMock = jest.fn()
			mockDocumentRequest(
				global.pdfFileChecksum,
				global.pdfHashEntriesPayload,
				global.pdfMetadataChecksum,
				global.pdfMetadata,
				fetchBasedHttpClientGetMock,
				session,
			)
			FetchBasedHttpClient.get = fetchBasedHttpClientGetMock

			const pdfHashEntry = Schemas.HashEntryFactory.fromPayload(global.pdfRootHashEntryPayload)

			const pdfDocument = await Sync.V3.FileFactory.fileFromHashEntry(pdfHashEntry, session)
			expect(pdfDocument).toBeInstanceOf(Sync.V3.Document)
		})
	})

	describe('.fileFromHashEntries', () => {
		it('if given a PDF file hash entries, returns a PDF Document instance', async () => {
			const fetchBasedHttpClientGetMock = jest.fn()
			mockDocumentMetadataRequest(
				global.pdfMetadataChecksum,
				global.pdfMetadata,
				fetchBasedHttpClientGetMock,
				session
			)
			FetchBasedHttpClient.get = fetchBasedHttpClientGetMock

			const pdfHashEntry = Schemas.HashEntryFactory.fromPayload(global.pdfRootHashEntryPayload)
			const pdfHashEntries = Schemas.HashEntriesFactory.fromPayload(global.pdfHashEntriesPayload)

			const pdfDocument = await Sync.V3.FileFactory.fileFromHashEntries(pdfHashEntry, pdfHashEntries, session)
			expect(pdfDocument).toBeInstanceOf(Sync.V3.Document)
		})

		it('if given an EPUB file hash entries, returns an ePub Document instance', async () => {
			const fetchBasedHttpClientGetMock = jest.fn()
			mockDocumentMetadataRequest(
				global.ePubMetadataChecksum,
				global.ePubMetadata,
				fetchBasedHttpClientGetMock,
				session
			)
			FetchBasedHttpClient.get = fetchBasedHttpClientGetMock

			const ePubHashEntry = Schemas.HashEntryFactory.fromPayload(global.ePubRootHashEntryPayload)
			const ePubHashEntries = Schemas.HashEntriesFactory.fromPayload(global.ePubHashEntriesPayload)

			const epubDocument = await Sync.V3.FileFactory.fileFromHashEntries(ePubHashEntry, ePubHashEntries, session)
			expect(epubDocument).toBeInstanceOf(Sync.V3.Document)
		})

		it('if given a folder hash entries, returns a Folder instance', async () => {
			const fetchBasedHttpClientGetMock = jest.fn()
			mockDocumentMetadataRequest(
				global.folderMetadataChecksum,
				global.folderMetadata,
				fetchBasedHttpClientGetMock,
				session
			)
			FetchBasedHttpClient.get = fetchBasedHttpClientGetMock

			const folderHashEntry = Schemas.HashEntryFactory.fromPayload(global.folderRootHashEntryPayload)
			const folderHashEntries = Schemas.HashEntriesFactory.fromPayload(global.folderHashEntriesPayload)

			const folderFile = await Sync.V3.FileFactory.fileFromHashEntries(folderHashEntry, folderHashEntries, session)
			expect(folderFile).toBeInstanceOf(Sync.V3.Folder)
		})
	})
})