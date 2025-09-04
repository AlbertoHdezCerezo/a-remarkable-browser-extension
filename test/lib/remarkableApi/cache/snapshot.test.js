import {expect, jest} from '@jest/globals'
import {CONFIGURATION} from '../../../../src/lib/remarkableApi'
import {Folder} from '../../../../src/lib/remarkableApi/cache/folder'
import {Document} from '../../../../src/lib/remarkableApi/cache/document'
import {Snapshot} from '../../../../src/lib/remarkableApi/cache/snapshot'
import * as Internal from '../../../../src/lib/remarkableApi/internal'
import {FetchBasedHttpClient} from '../../../../src/lib/utils/httpClient'

describe('Snapshot', () => {
	const root = global.root
	const session = global.session
	const apiFolder = global.folder

	describe('.fromJson', () => {
		it('from a snapshot JSON, returns Snapshot instance', () => {
			const snapshotJson = JSON.stringify({
				rootChecksum: root.checksum,
				rootGeneration: root.generation,
				rootHashEntriesPayload: root.hashEntries.payload,
				documents: [],
				folders: [{
					folderRootHashEntryPayload: apiFolder.rootHashEntry.payload,
					folderHashEntriesPayload: apiFolder.hashEntries.payload,
					folderMetadataPayload: apiFolder.metadata.payload
				}]
			})

			const snapshot = Snapshot.fromJson(snapshotJson, root)

			expect(snapshot).toBeInstanceOf(Snapshot)
			expect(snapshot.root).toBeDefined()
			expect(snapshot.documents).toBeInstanceOf(Array)
			expect(snapshot.folders).toBeInstanceOf(Array)
			expect(snapshot.documents.length).toBe(0)
			expect(snapshot.folders.length).toBe(1)
			expect(snapshot.folders[0]).toBeInstanceOf(Folder)
		})
	})

	// describe('.fromSession', () => {
	// 	it('fetches hash entries and metadata from all documents and folders in reMarkable account', async () => {
	// 		Internal.Sync.Root.fromSession = jest.fn()
	// 		Internal.Sync.Root
	// 			.fromSession
	// 			.mockImplementationOnce((...args) => Promise.resolve(global.root))
	//
	// 		FetchBasedHttpClient.get = jest.fn()
	// 		FetchBasedHttpClient
	// 			.get
	// 			.mockImplementationOnce((...args) => {
	// 				expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.root)
	// 				expect(args[1]).toEqual({'Authorization': `Bearer ${session.token}`})
	//
	// 				return Promise.resolve({ok: true, status: 200, json: () => Promise.resolve(global.rootMetadata)})
	// 			})
	// 		FetchBasedHttpClient
	// 			.get
	// 			.mockImplementationOnce((...args) => {
	// 				expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.files + global.rootHashChecksum)
	// 				expect(args[1]).toEqual({'Authorization': `Bearer ${session.token}`})
	//
	// 				return Promise.resolve({ok: true, status: 200, text: () => Promise.resolve(global.rootHashEntriesPayload)})
	// 			})
	//
	// 		global.root.hashEntries.hashEntriesList.forEach((hashEntry) => {
	// 			FetchBasedHttpClient
	// 				.get
	// 				.mockImplementationOnce((...args) => {
	// 					expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.files + hashEntry.checksum)
	// 					expect(args[1]).toEqual({'Authorization': `Bearer ${session.token}`})
	//
	// 					const hashEntryContent =
	//
	// 					return Promise.resolve({ok: true, status: 200, text: () => Promise.resolve(global.rootHashEntriesPayload)})
	// 				})
	// 		})
	//
	// 		const snapshot = Snapshot.fromSession(session)
	//
	// 		expect(snapshot).toBeInstanceOf(Snapshot)
	// 		expect(snapshot.root).toBeDefined()
	// 		expect(snapshot.documents).toBeInstanceOf(Array)
	// 		expect(snapshot.folders).toBeInstanceOf(Array)
	// 		expect(snapshot.documents.length).toBe(2)
	// 		expect(snapshot.documents[0]).toBe(Document)
	// 		expect(snapshot.folders.length).toBe(1)
	// 		expect(snapshot.folders[0]).toBeInstanceOf(Folder)
	// 	})
	// })

	describe('#toJson', () => {
		it('returns JSON representation of the snapshot', () => {
			const snapshot = new Snapshot(root, [], [new Folder(apiFolder)])

			expect(snapshot.toJson).toEqual(
				JSON.stringify({
					rootChecksum: root.checksum,
					rootGeneration: root.generation,
					rootHashEntriesPayload: root.hashEntries.payload,
					documents: [],
					folders: [{
						folderRootHashEntryPayload: apiFolder.rootHashEntry.payload,
						folderHashEntriesPayload: apiFolder.hashEntries.payload,
						folderMetadataPayload: apiFolder.metadata.payload
					}]
				})
			)
		})
	})
})