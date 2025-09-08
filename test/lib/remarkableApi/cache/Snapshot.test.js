import {expect, jest} from '@jest/globals'
import {
	mockDocumentHashEntriesRequest,
	mockDocumentMetadataRequest,
	mockDocumentRequest,
	mockRootRequest
} from '../../../helpers/remarkableApiHelper.js'
import * as Cache from '../../../../src/lib/remarkableApi/cache'
import * as Sync from '../../../../src/lib/remarkableApi/internal/sync'
import * as Schemas from '../../../../src/lib/remarkableApi/internal/schemas'
import {FetchBasedHttpClient} from '../../../../src/lib/utils/httpClient'

describe('Snapshot', () => {
	const session = global.remarkableApiSession

	describe('.fromSession', () => {
		it('loads root and all files underneath, returning a new snapshot instance', async () => {
			const fetchBasedHttpClientGetMock = jest.fn()
			mockRootRequest(fetchBasedHttpClientGetMock, session)

			global.root.hashEntries.hashEntriesList.forEach((hashEntry) => {
				const file = [
					global.pdfFile,
					global.ePubFile,
					global.folder
				].find(file => file.rootHashEntry.fileId === hashEntry.fileId)

				mockDocumentHashEntriesRequest(
					file.rootHashEntry.checksum,
					file.hashEntries.payload,
					fetchBasedHttpClientGetMock,
					session,
				)
			})

			global.root.hashEntries.hashEntriesList.forEach((hashEntry) => {
				const file = [
					global.pdfFile,
					global.ePubFile,
					global.folder
				].find(file => file.rootHashEntry.fileId === hashEntry.fileId)

				const fileMetadataHashEntry =
					file.hashEntries.hashEntriesList.find(entry => entry.fileExtension === 'metadata')

				mockDocumentMetadataRequest(
					fileMetadataHashEntry.checksum,
					file.metadata.payload,
					fetchBasedHttpClientGetMock,
					session
				)
			})
			FetchBasedHttpClient.get = fetchBasedHttpClientGetMock

			const snapshot = await Cache.Snapshot.fromSession(session)

			expect(snapshot).toBeInstanceOf(Cache.Snapshot)
			expect(snapshot.root.checksum).toBe(global.root.checksum)
			expect(snapshot.root.generation).toBe(global.root.generation)
			expect(snapshot.documents.length).toBe(2)
			expect(snapshot.folders.length).toBe(1)
		})
	})

	describe('#synchronize', () => {
		it('if root generation has not changed, do nothing', async () => {
			const snapshot = new Cache.Snapshot(
				global.root,
				[global.pdfFile, global.ePubFile],
				[global.folder]
			)

			const fetchBasedHttpClientGetMock = jest.fn()
			mockRootRequest(fetchBasedHttpClientGetMock, session)
			FetchBasedHttpClient.get = fetchBasedHttpClientGetMock

			await snapshot.synchronize(session)
		})

		it('if root generation has changed, aligns snapshot with the latest state in the reMarkable account', async () => {
			/**
			 * We are going to emulate a root with an older version
			 * than the one we use from our fixtures, so we check
			 * the synchronization makes all the checks needed to work
			 */
			const root = new Sync.V3.Root(
				'f1c4e71ee19b26fda596b84e929e936c77aef64644a68253854b4db795b48b1e',
				1756597331766284,
				Schemas.HashEntriesFactory.fromPayload(`
					4
					0:.:4:40152142
					e8e5d89278eebfded00982a272393d62fbd7fab1d9b4fc99b001f6ba342260c3:0:00a69f8e-8a4f-431b-b8d0-635114f7e958:4:40152142
				`.trim().replace(/\t/g, ''))
			)

			const outdatedPdfFile = new Sync.V3.Document(
				root.hashEntries.hashEntriesList[0],
				Schemas.HashEntriesFactory.fromPayload(global.pdfHashEntriesPayload),
				new Sync.V3.DocumentMetadata(
					root.hashEntries.hashEntriesList[0],
					Object.assign(global.pdfMetadata, {visibleName: "This should not be seen.pdf"})
				)
			)

			const fetchBasedHttpClientGetMock = jest.fn()
			mockRootRequest(fetchBasedHttpClientGetMock, session)
			// First mock the file which is outdated
			mockDocumentRequest(
				global.pdfFile.rootHashEntry.checksum,
				global.pdfFile.hashEntries.payload,
				global.pdfMetadataChecksum,
				global.pdfFile.metadata.payload,
				fetchBasedHttpClientGetMock,
				session
			)
			// Then mock the files present in the new root
			global.root.hashEntries.hashEntriesList.forEach((hashEntry) => {
				const file = [
					global.ePubFile,
					global.folder
				].find(file => file.rootHashEntry.fileId === hashEntry.fileId)

				if (file !== undefined) {
					mockDocumentHashEntriesRequest(
						file.rootHashEntry.checksum,
						file.hashEntries.payload,
						fetchBasedHttpClientGetMock,
						session,
					)
				}
			})

			global.root.hashEntries.hashEntriesList.forEach((hashEntry) => {
				const file = [
					global.ePubFile,
					global.folder
				].find(file => file.rootHashEntry.fileId === hashEntry.fileId)

				if (file !== undefined) {
					const fileMetadataHashEntry =
						file.hashEntries.hashEntriesList.find(entry => entry.fileExtension === 'metadata')

					mockDocumentMetadataRequest(
						fileMetadataHashEntry.checksum,
						file.metadata.payload,
						fetchBasedHttpClientGetMock,
						session
					)
				}
			})

			FetchBasedHttpClient.get = fetchBasedHttpClientGetMock

			const snapshot = new Cache.Snapshot(root, [outdatedPdfFile], [])

			await snapshot.synchronize(session)

			expect(snapshot.root.generation).toBe(global.root.generation)
			expect(snapshot.documents.length).toBe(2)
			expect(snapshot.folders.length).toBe(1)
		})
	})

	describe('.deserialize', () => {
		it('coerces string representing a serialized snapshot to a snapshot instance', () => {
			const snapshot = new Cache.Snapshot(
				global.root,
				[global.pdfFile, global.ePubFile],
				[global.folder]
			)

			const serializedSnapshot = snapshot.serialize()

			const deserializedSnapshot = Cache.Snapshot.deserialize(serializedSnapshot)

			expect(deserializedSnapshot.root.serialize())
				.toBe(snapshot.root.serialize())

			deserializedSnapshot.documents.forEach((document, index) => {
				const expectedDocument = snapshot.documents[index]
				expect(document.rootHashEntry.payload).toBe(expectedDocument.rootHashEntry.payload)
				expect(document.hashEntries.payload).toEqual(expectedDocument.hashEntries.payload)
			})

			deserializedSnapshot.folders.forEach((folder, index) => {
				const expectedFolder = snapshot.folders[index]
				expect(folder.rootHashEntry.payload).toBe(expectedFolder.rootHashEntry.payload)
				expect(folder.hashEntries.payload).toEqual(expectedFolder.hashEntries.payload)
			})
		})
	})

	describe('#serialize', () => {
		it('coerces snapshot instance to a JSON stringified representation of it', () => {
			const snapshot = new Cache.Snapshot(
				global.root,
				[global.pdfFile, global.ePubFile],
				[global.folder]
			)

			const serializedSnapshot = snapshot.serialize()

			const parsedSerializedSnapshot = JSON.parse(serializedSnapshot)

			expect(parsedSerializedSnapshot.root).toBe(snapshot.root.serialize())
			expect(parsedSerializedSnapshot.documents).toEqual(snapshot.documents.map(document => document.serialize()))
			expect(parsedSerializedSnapshot.folders).toEqual(snapshot.folders.map(folder => folder.serialize()))
		})
	})
})
