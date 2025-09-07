import {expect, jest} from '@jest/globals'
import {
	mockDocumentMetadataRequest,
	mockDocumentRequest,
	mockRootRequest
} from '../../../../../../helpers/remarkableApiHelper.js'
import {CONFIGURATION} from '../../../../../../../src/lib/remarkableApi/index.js'
import * as Sync from '../../../../../../../src/lib/remarkableApi/internal/sync/index.js'
import * as Schemas from '../../../../../../../src/lib/remarkableApi/internal/schemas/index.js'
import {FetchBasedHttpClient} from '../../../../../../../src/lib/utils/httpClient/index.js'

describe('Document', () => {
	const root = global.root
	const session = global.remarkableApiSession
	const pdfFileRootHashEntry = Schemas.HashEntryFactory.fromPayload(global.pdfRootHashEntryPayload)
	const pdfHashEntries = Schemas.HashEntriesFactory.fromPayload(global.pdfHashEntriesPayload)
	const folderHashEntries = Schemas.HashEntriesFactory.fromPayload(global.folderHashEntriesPayload)

	describe('.fromHashEntry', () => {
		it('returns PDF file from root PDF file hash entry', async () => {
			FetchBasedHttpClient.get = jest.fn()
			FetchBasedHttpClient
				.get
				.mockImplementationOnce((...args) => {
					expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.files + global.pdfFileChecksum)
					expect(args[1]).toEqual({'Authorization': `Bearer ${session.token}`})

					return Promise.resolve({ok: true, status: 200, text: () => Promise.resolve(global.pdfHashEntriesPayload)})
				})
			FetchBasedHttpClient
				.get
				.mockImplementationOnce((...args) => {
					expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.files + global.pdfMetadataChecksum)
					expect(args[1]).toEqual({'Authorization': `Bearer ${session.token}`})

					return Promise.resolve({ok: true, status: 200, text: () => Promise.resolve(global.pdfMetadata)})
				})

			const pdfFile = await Sync.V3.Document.fromHashEntry(root, pdfFileRootHashEntry, session)

			expect(pdfFile).toBeInstanceOf(Sync.V3.Document)
		})
	})

	describe('.fromHashEntries', () => {
		it('returns document from provided hash entries', async () => {
			const fetchBasedHttpClientGetMock = jest.fn()
			mockDocumentMetadataRequest(
				global.pdfMetadataChecksum,
				global.pdfMetadata,
				session
			)
			FetchBasedHttpClient.get = fetchBasedHttpClientGetMock

			const pdfFile = await Sync.V3.Document.fromHashEntries(root, pdfFileRootHashEntry, pdfHashEntries, session)

			expect(pdfFile).toBeInstanceOf(Sync.V3.Document)
		})

		it('if provided hash entries do not represent a document, throws an error', async () => {
			FetchBasedHttpClient.get = jest.fn()
			FetchBasedHttpClient
				.get
				.mockImplementationOnce((...args) => {
					expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.files + global.ePubMetadataChecksum)
					expect(args[1]).toEqual({'Authorization': `Bearer ${session.token}`})

					return Promise.resolve({ok: true, status: 200, text: () => Promise.resolve(global.ePubMetadata)})
				})

			try {
				await Sync.V3.Document.fromHashEntries(root, ePubFileRootHashEntry, epubHashEntries, session)
			} catch (error) {
				expect(error instanceof Sync.V3.PdfIncompatibleHashEntriesError).toBe(true)
			}
		})
	})

	describe('.compatibleWithHashEntries', () => {
		it('if given hash entries resemble a reMarkable PDF file, returns true', async () => {
			expect(Sync.V3.Document.compatibleWithHashEntries(pdfHashEntries)).toBe(true)
		})

		it('if given hash entries do not resemble a reMarkable PDF file, returns false', async () => {
			expect(Sync.V3.Document.compatibleWithHashEntries(folderHashEntries)).toBe(false)
		})
	})

	describe('#name', () => {
		it('returns document name', () => {
			expect(global.pdfFile.name).toBe(global.pdfFile.metadata.documentName)
		})
	})

	describe('#extension', () => {
		it('given a PDF Document, returns pdf', () => {
			expect(global.pdfFile.extension).toBe('pdf')
		})

		it('given an ePub Document, returns epub', () => {
			expect(global.ePubFile.extension).toBe('epub')
		})
	})

	describe('#refreshFile', () => {
		it('if current file is not outdated, do nothing', async () => {
			const fetchBasedHttpClientGetMock = jest.fn()
			mockRootRequest(
				fetchBasedHttpClientGetMock,
				session,
				global.rootMetadata,
				global.rootHashChecksum,
				global.rootHashEntriesPayload
			)
			FetchBasedHttpClient.get = fetchBasedHttpClientGetMock

			await global.ePubFile.refresh(session)
		})

		it('if current file is outdated, synchronizes current file instance with the cloud', async () => {
			const fetchBasedHttpClientGetMock = jest.fn()
			mockRootRequest(
				fetchBasedHttpClientGetMock,
				session,
				global.rootMetadata,
				global.rootHashChecksum,
				global.rootHashEntriesPayload
			)
			mockDocumentRequest(
				global.pdfFileChecksum,
				global.ePubHashEntriesPayload,
				global.ePubMetadataChecksum,
				global.ePubMetadata,
				fetchBasedHttpClientGetMock,
				session
			)
			FetchBasedHttpClient.get = fetchBasedHttpClientGetMock

			/**
			 * We will mock the flow to refresh the PDF file, so the
			 * HTTP client returns the ePub file. This should trigger
			 * the refresh of the current PDF file instance, returning
			 * an ePub file instead.
			 */
			const ePubFile = await global.pdfFile.refresh(session)

			expect(ePubFile).toBeInstanceOf(Sync.V3.Document)
			expect(ePubFile.extension).toBe('epub')
		})
	})
})
