import {expect, jest} from '@jest/globals'
import {
	mockDocumentMetadataRequest,
	mockDocumentRequest,
	mockRootRequest
} from '../../../../../../helpers/remarkableApiHelper.js'
import * as Sync from '../../../../../../../src/lib/remarkableApi/internal/sync/index.js'
import * as Schemas from '../../../../../../../src/lib/remarkableApi/internal/schemas/index.js'
import {FetchBasedHttpClient} from '../../../../../../../src/lib/utils/httpClient/index.js'

describe('Document', () => {
	const session = global.remarkableApiSession
	const pdfFileRootHashEntry = Schemas.HashEntryFactory.fromPayload(global.pdfRootHashEntryPayload)
	const pdfHashEntries = Schemas.HashEntriesFactory.fromPayload(global.pdfHashEntriesPayload)
	const folderRootHashEntry = Schemas.HashEntryFactory.fromPayload(global.folderRootHashEntryPayload)
	const folderHashEntries = Schemas.HashEntriesFactory.fromPayload(global.folderHashEntriesPayload)

	describe('.fromHashEntry', () => {
		it('returns Document from root Document hash entry', async () => {
			const fetchBasedHttpClientGetMock = jest.fn()
			mockDocumentRequest(
				global.pdfFileChecksum,
				global.pdfHashEntriesPayload,
				global.pdfMetadataChecksum,
				global.pdfMetadata,
				fetchBasedHttpClientGetMock,
				session
			)
			FetchBasedHttpClient.get = fetchBasedHttpClientGetMock

			const pdfFile = await Sync.V3.Document.fromHashEntry(pdfFileRootHashEntry, session)

			expect(pdfFile).toBeInstanceOf(Sync.V3.Document)
		})
	})

	describe('.fromHashEntries', () => {
		it('returns document from provided hash entries', async () => {
			const fetchBasedHttpClientGetMock = jest.fn()
			mockDocumentMetadataRequest(
				global.pdfMetadataChecksum,
				global.pdfMetadata,
				fetchBasedHttpClientGetMock,
				session
			)
			FetchBasedHttpClient.get = fetchBasedHttpClientGetMock

			const pdfFile = await Sync.V3.Document.fromHashEntries(pdfFileRootHashEntry, pdfHashEntries, session)

			expect(pdfFile).toBeInstanceOf(Sync.V3.Document)
		})

		it('if provided hash entries do not represent a document, throws an error', async () => {
			try {
				await Sync.V3.Document.fromHashEntries(folderRootHashEntry, folderHashEntries, session)
			} catch (error) {
				expect(error instanceof Sync.V3.DocumentIncompatibleHashEntriesError).toBe(true)
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
			jest.spyOn(global.pdfFile.rootHashEntry, 'checksum', 'get')
				.mockReturnValue(global.ePubFileChecksum)

			const ePubFile = await global.pdfFile.refresh(session)

			expect(ePubFile).toBeInstanceOf(Sync.V3.Document)
			expect(ePubFile.extension).toBe('epub')
		})
	})

	describe('#serialize', () => {
		it('coerces document instance to a JSON stringified representation of it', () => {
			const serializedPdf = global.pdfFile.serialize()

			const parsedSerializedPdf = JSON.parse(serializedPdf)

			expect(parsedSerializedPdf.rootHashEntry).toBe(global.pdfFile.rootHashEntry.payload)
			expect(parsedSerializedPdf.hashEntries).toEqual(global.pdfFile.hashEntries.payload)
			expect(parsedSerializedPdf.metadata).toEqual(global.pdfFile.metadata.serialize())
		})
	})

	describe('.deserialize', () => {
		it('coerces string representing a serialized document to a document instance', () => {
			const expectedDocument = global.pdfFile

			const serializedDocument = global.pdfFile.serialize()

			const deserializedDocument = Sync.V3.Document.deserialize(serializedDocument)

			expect(deserializedDocument.rootHashEntry.payload).toBe(expectedDocument.rootHashEntry.payload)
			expect(deserializedDocument.hashEntries.payload).toEqual(expectedDocument.hashEntries.payload)
			expect(deserializedDocument.metadata.rootHashEntry.payload).toEqual(expectedDocument.metadata.rootHashEntry.payload)
			expect(deserializedDocument.metadata.payload).toEqual(expectedDocument.metadata.payload)
		})
	})
})
