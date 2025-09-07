import {expect, jest} from '@jest/globals'
import {CONFIGURATION} from '../../../../../../../src/lib/remarkableApi/index.js'
import {
	mockDocumentMetadataRequest,
	mockDocumentRequest,
	mockRootRequest
} from '../../../../../../helpers/remarkableApiHelper.js'
import * as Sync from '../../../../../../../src/lib/remarkableApi/internal/sync/index.js'
import * as Schemas from '../../../../../../../src/lib/remarkableApi/internal/schemas/index.js'
import {FetchBasedHttpClient} from '../../../../../../../src/lib/utils/httpClient/index.js'

describe('Folder', () => {
	const session = global.remarkableApiSession
	const folderRootHashEntry = Schemas.HashEntryFactory.fromPayload(global.folderRootHashEntryPayload)
	const pdfFileRootHashEntry = Schemas.HashEntryFactory.fromPayload(global.pdfRootHashEntryPayload)
	const folderHashEntries = Schemas.HashEntriesFactory.fromPayload(global.folderHashEntriesPayload)
	const pdfHashEntries = Schemas.HashEntriesFactory.fromPayload(global.pdfHashEntriesPayload)

	describe('.fromHashEntry', () => {
		it('returns folder from root folder hash entry', async () => {
			const fetchBasedHttpClientGetMock = jest.fn()
			mockDocumentRequest(
				global.folderFileChecksum,
				global.folderHashEntriesPayload,
				global.folderMetadataChecksum,
				global.folderMetadata,
				fetchBasedHttpClientGetMock,
				session
			)
			FetchBasedHttpClient.get = fetchBasedHttpClientGetMock

			const folder = await Sync.V3.Folder.fromHashEntry(folderRootHashEntry, session)

			expect(folder).toBeInstanceOf(Sync.V3.Folder)
		})
	})

	describe('.fromHashEntries', () => {
		it('returns folder from provided hash entries', async () => {
			const fetchBasedHttpClientGetMock = jest.fn()
			mockDocumentMetadataRequest(
				global.folderMetadataChecksum,
				global.folderMetadata,
				fetchBasedHttpClientGetMock,
				session
			)
			FetchBasedHttpClient.get = fetchBasedHttpClientGetMock

			const folder = await Sync.V3.Folder.fromHashEntries(folderRootHashEntry, folderHashEntries, session)

			expect(folder).toBeInstanceOf(Sync.V3.Folder)
		})

		it('if provided hash entries do not represent a folder, throws an error', async () => {
			try {
				await Sync.V3.Folder.fromHashEntries(pdfFileRootHashEntry, pdfHashEntries, session)
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

	describe('#name', () => {
		it('returns document name', () => {
			expect(global.folder.name).toBe(global.folder.metadata.folderName)
		})
	})

	describe('#extension', () => {
		it('returns folder', () => {
			expect(global.folder.extension).toBe('folder')
		})
	})


	describe('#serialize', () => {
		it('coerces folder instance to a JSON stringified representation of it', () => {
			const serializedFolder = global.folder.serialize()

			const parsedSerializedFolder = JSON.parse(serializedFolder)

			expect(parsedSerializedFolder.rootHashEntry).toBe(global.folder.rootHashEntry.payload)
			expect(parsedSerializedFolder.hashEntries).toEqual(global.folder.hashEntries.payload)
			expect(parsedSerializedFolder.metadata).toEqual(global.folder.metadata.serialize())
		})
	})

	describe('.deserialize', () => {
		it('coerces string representing a serialized folder to a folder instance', () => {
			const expectedFolder = global.folder

			const serializedFolder = global.folder.serialize()

			const deserializedFolder = Sync.V3.Document.deserialize(serializedFolder)

			expect(deserializedFolder.rootHashEntry.payload).toBe(expectedFolder.rootHashEntry.payload)
			expect(deserializedFolder.hashEntries.payload).toEqual(expectedFolder.hashEntries.payload)
			expect(deserializedFolder.metadata.rootHashEntry.payload).toEqual(expectedFolder.metadata.rootHashEntry.payload)
			expect(deserializedFolder.metadata.payload).toEqual(expectedFolder.metadata.payload)
		})
	})
})