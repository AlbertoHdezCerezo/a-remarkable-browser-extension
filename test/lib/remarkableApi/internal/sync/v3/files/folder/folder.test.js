import {expect, jest} from '@jest/globals'
import {CONFIGURATION} from '../../../../../../../../src/lib/remarkableApi'
import * as Sync from '../../../../../../../../src/lib/remarkableApi/internal/sync'
import * as Schemas from '../../../../../../../../src/lib/remarkableApi/internal/schemas'
import {FetchBasedHttpClient} from "../../../../../../../../src/lib/utils/httpClient/index.js";

describe('Folder', () => {
	const root = global.root
	const session = global.remarkableApiSession
	const folderHashEntry = Schemas.HashEntryFactory.fromPayload(global.folderRootHashEntryPayload)
	const pdfFileRootHashEntry = Schemas.HashEntryFactory.fromPayload(global.pdfRootHashEntryPayload)
	const folderHashEntries = Schemas.HashEntriesFactory.fromPayload(global.folderHashEntriesPayload)
	const pdfHashEntries = Schemas.HashEntriesFactory.fromPayload(global.pdfHashEntriesPayload)

	describe('.fromHashEntry', () => {
		it('returns folder from root folder hash entry', async () => {
			FetchBasedHttpClient.get = jest.fn()
			FetchBasedHttpClient
				.get
				.mockImplementationOnce((...args) => {
					expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.files + global.folderFileChecksum)
					expect(args[1]).toEqual({'Authorization': `Bearer ${session.token}`})

					return Promise.resolve({ok: true, status: 200, text: () => Promise.resolve(global.folderHashEntriesPayload)})
				})
			FetchBasedHttpClient
				.get
				.mockImplementationOnce((...args) => {
					expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.files + global.folderMetadataChecksum)
					expect(args[1]).toEqual({'Authorization': `Bearer ${session.token}`})

					return Promise.resolve({ok: true, status: 200, text: () => Promise.resolve(global.folderMetadata)})
				})

			const folder = await Sync.V3.Folder.fromHashEntry(root, folderHashEntry, session)

			expect(folder).toBeInstanceOf(Sync.V3.Folder)
		})

		it('if root hash entry does not represent a folder, throws an error', async () => {
			FetchBasedHttpClient.get = jest.fn()
			FetchBasedHttpClient
				.get
				.mockImplementationOnce((...args) => {
					expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.files + global.pdfFileChecksum)
					expect(args[1]).toEqual({'Authorization': `Bearer ${session.token}`})

					return Promise.resolve({ok: true, status: 200, text: () => Promise.resolve(global.pdfHashEntriesPayload)})
				})

			try {
				await Sync.V3.Folder.fromHashEntry(root, pdfFileRootHashEntry, session)
			} catch (error) {
				expect(error instanceof Sync.V3.FolderIncompatibleHashEntriesError).toBe(true)
			}
		})
	})

	describe('.fromHashEntries', () => {
		it('returns folder from provided hash entries', async () => {
			FetchBasedHttpClient.get = jest.fn()
			FetchBasedHttpClient
				.get
				.mockImplementationOnce((...args) => {
					expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.files + global.folderMetadataChecksum)
					expect(args[1]).toEqual({'Authorization': `Bearer ${session.token}`})

					return Promise.resolve({ok: true, status: 200, text: () => Promise.resolve(global.folderMetadata)})
				})

			const folder = await Sync.V3.Folder.fromHashEntries(root, folderHashEntry, folderHashEntries, session)

			expect(folder).toBeInstanceOf(Sync.V3.Folder)
		})

		it('if provided hash entries do not represent a folder, throws an error', async () => {
			FetchBasedHttpClient.get = jest.fn()
			FetchBasedHttpClient
				.get
				.mockImplementationOnce((...args) => {
					expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.files + global.pdfMetadataChecksum)
					expect(args[1]).toEqual({'Authorization': `Bearer ${session.token}`})

					return Promise.resolve({ok: true, status: 200, text: () => Promise.resolve(global.pdfMetadata)})
				})

			try {
				await Sync.V3.Folder.fromHashEntries(root, pdfFileRootHashEntry, pdfHashEntries, session)
			} catch (error) {
				expect(error instanceof Sync.V3.FolderIncompatibleHashEntriesError).toBe(true)
			}
		})
	})

	describe('.compatibleWithHashEntries', () => {
		it('if given hash entries resemble a reMarkable folder, returns true', () => {
			expect(Sync.V3.Folder.compatibleWithHashEntries(folderHashEntries)).toBe(true)
		})

		it('if given hash entries do not resemble a reMarkable folder, returns false', () => {
			expect(Sync.V3.Folder.compatibleWithHashEntries(pdfHashEntries)).toBe(false)
		})
	})
})