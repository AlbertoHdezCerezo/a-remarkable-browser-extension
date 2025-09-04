import {expect, jest} from '@jest/globals'
import {CONFIGURATION} from '../../../../../../../../src/lib/remarkableApi'
import * as Sync from '../../../../../../../../src/lib/remarkableApi/internal/sync'
import * as Schemas from '../../../../../../../../src/lib/remarkableApi/internal/schemas'
import {FetchBasedHttpClient} from '../../../../../../../../src/lib/utils/httpClient'

describe('EpubFile', () => {
	const root = global.root
	const session = global.remarkableApiSession
	const ePubFileRootHashEntry = Schemas.HashEntryFactory.fromPayload(global.ePubRootHashEntryPayload)
	const pdfFileRootHashEntry = Schemas.HashEntryFactory.fromPayload(global.pdfRootHashEntryPayload)
	const epubHashEntries = Schemas.HashEntriesFactory.fromPayload(global.ePubHashEntriesPayload)
	const pdfHashEntries = Schemas.HashEntriesFactory.fromPayload(global.pdfHashEntriesPayload)

	describe('.fromHashEntry', () => {
		it('returns ePub file from root ePub file hash entry', async () => {
			FetchBasedHttpClient.get = jest.fn()
			FetchBasedHttpClient
				.get
				.mockImplementationOnce((...args) => {
					expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.files + global.ePubFileChecksum)
					expect(args[1]).toEqual({'Authorization': `Bearer ${session.token}`})

					return Promise.resolve({ok: true, status: 200, text: () => Promise.resolve(global.ePubHashEntriesPayload)})
				})
			FetchBasedHttpClient
				.get
				.mockImplementationOnce((...args) => {
					expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.files + global.ePubMetadataChecksum)
					expect(args[1]).toEqual({'Authorization': `Bearer ${session.token}`})

					return Promise.resolve({ok: true, status: 200, text: () => Promise.resolve(global.ePubMetadata)})
				})

			const ePubFile = await Sync.V3.EpubFile.fromHashEntry(root, ePubFileRootHashEntry, session)

			expect(ePubFile).toBeInstanceOf(Sync.V3.EpubFile)
		})

		it('if root hash entry does not represent a ePub file, throws an error', async () => {
			FetchBasedHttpClient.get = jest.fn()
			FetchBasedHttpClient
				.get
				.mockImplementationOnce((...args) => {
					expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.files + global.pdfFileChecksum)
					expect(args[1]).toEqual({'Authorization': `Bearer ${session.token}`})

					return Promise.resolve({ok: true, status: 200, text: () => Promise.resolve(global.pdfHashEntriesPayload)})
				})

			try {
				await Sync.V3.EpubFile.fromHashEntry(root, pdfFileRootHashEntry, session)
			} catch (error) {
				expect(error).toBeInstanceOf(Sync.V3.EpubIncompatibleHashEntriesError)
			}
		})
	})

	describe('.fromHashEntries', () => {
		it('returns ePub file from provided hash entries', async () => {
			FetchBasedHttpClient.get = jest.fn()
			FetchBasedHttpClient
				.get
				.mockImplementationOnce((...args) => {
					expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.files + global.ePubMetadataChecksum)
					expect(args[1]).toEqual({'Authorization': `Bearer ${session.token}`})

					return Promise.resolve({ok: true, status: 200, text: () => Promise.resolve(global.ePubMetadata)})
				})

			const ePubFile = await Sync.V3.EpubFile.fromHashEntries(root, ePubFileRootHashEntry, epubHashEntries, session)

			expect(ePubFile).toBeInstanceOf(Sync.V3.EpubFile)
		})

		it('if provided hash entries do not represent a ePub file, throws an error', async () => {
			try {
				await Sync.V3.EpubFile.fromHashEntries(root, pdfFileRootHashEntry, pdfHashEntries, session)
			} catch (error) {
				expect(error instanceof Sync.V3.EpubIncompatibleHashEntriesError).toBe(true)
			}
		})
	})

	describe('.compatibleWithHashEntries', () => {
		it('returns true if hash entries resemble a reMarkable ePub file', async () => {
			expect(Sync.V3.EpubFile.compatibleWithHashEntries(epubHashEntries)).toBe(true)
		})

		it('returns false if hash entries do not resemble a reMarkable ePub file', async () => {
			expect(Sync.V3.EpubFile.compatibleWithHashEntries(pdfHashEntries)).toBe(false)
		})
	})
})
