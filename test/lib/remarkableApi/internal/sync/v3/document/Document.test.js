import {expect, jest} from '@jest/globals'
import {CONFIGURATION} from '../../../../../../../src/lib/remarkableApi/index.js'
import * as Sync from '../../../../../../../src/lib/remarkableApi/internal/sync/index.js'
import * as Schemas from '../../../../../../../src/lib/remarkableApi/internal/schemas/index.js'
import {FetchBasedHttpClient} from '../../../../../../../src/lib/utils/httpClient/index.js'

describe('PdfFile', () => {
	const root = global.root
	const session = global.remarkableApiSession
	const ePubFileRootHashEntry = Schemas.HashEntryFactory.fromPayload(global.ePubRootHashEntryPayload)
	const pdfFileRootHashEntry = Schemas.HashEntryFactory.fromPayload(global.pdfRootHashEntryPayload)
	const epubHashEntries = Schemas.HashEntriesFactory.fromPayload(global.ePubHashEntriesPayload)
	const pdfHashEntries = Schemas.HashEntriesFactory.fromPayload(global.pdfHashEntriesPayload)

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

			const pdfFile = await Sync.V3.Document.Document.fromHashEntry(root, pdfFileRootHashEntry, session)

			expect(pdfFile).toBeInstanceOf(Sync.V3.Document)
		})

		it('if root hash entry does not represent a PDF file, throws an error', async () => {
			FetchBasedHttpClient.get = jest.fn()
			FetchBasedHttpClient
				.get
				.mockImplementationOnce((...args) => {
					expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.files + global.ePubFileChecksum)
					expect(args[1]).toEqual({'Authorization': `Bearer ${session.token}`})

					return Promise.resolve({ok: true, status: 200, text: () => Promise.resolve(global.ePubHashEntriesPayload)})
				})

			try {
				await Sync.V3.Document.Document.fromHashEntry(root, ePubFileRootHashEntry, session)
			} catch (error) {
				expect(error instanceof Sync.V3.PdfIncompatibleHashEntriesError).toBe(true)
			}
		})
	})

	describe('.fromHashEntries', () => {
		it('returns PDF file from provided hash entries', async () => {
			FetchBasedHttpClient.get = jest.fn()
			FetchBasedHttpClient
				.get
				.mockImplementationOnce((...args) => {
					expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.files + global.pdfMetadataChecksum)
					expect(args[1]).toEqual({'Authorization': `Bearer ${session.token}`})

					return Promise.resolve({ok: true, status: 200, text: () => Promise.resolve(global.pdfMetadata)})
				})

			const pdfFile = await Sync.V3.Document.Document.fromHashEntries(root, pdfFileRootHashEntry, pdfHashEntries, session)

			expect(pdfFile).toBeInstanceOf(Sync.V3.Document.Document)
		})

		it('if provided hash entries do not represent a PDF file, throws an error', async () => {
			FetchBasedHttpClient.get = jest.fn()
			FetchBasedHttpClient
				.get
				.mockImplementationOnce((...args) => {
					expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.files + global.ePubMetadataChecksum)
					expect(args[1]).toEqual({'Authorization': `Bearer ${session.token}`})

					return Promise.resolve({ok: true, status: 200, text: () => Promise.resolve(global.ePubMetadata)})
				})

			try {
				await Sync.V3.Document.Document.fromHashEntries(root, ePubFileRootHashEntry, epubHashEntries, session)
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
			expect(Sync.V3.Document.compatibleWithHashEntries(epubHashEntries)).toBe(false)
		})
	})
})
