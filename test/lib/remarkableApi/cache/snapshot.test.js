import {setupHttpRecording} from '../../../helpers/pollyHelper'
import Snapshot from '../../../../src/lib/remarkableApi/cache/snapshot'
import Document from '../../../../src/lib/remarkableApi/cache/document'
import Folder from '../../../../src/lib/remarkableApi/cache/folder'
import Root from "../../../../src/lib/remarkableApi/internal/sync/root.js";
import {HashEntriesFactory} from "../../../../src/lib/remarkableApi/internal/schemas/index.js";
import ApiFolder from "../../../../src/lib/remarkableApi/internal/sync/v3/files/folder/folder.js";

describe('Snapshot', () => {
	setupHttpRecording()

	const root = new Root(
		'9d8a6b1057a54a0dc85eed97fdc9f2e6f3ea99d991209538b4555ffc482979c7',
		1754913481721295,
		HashEntriesFactory.fromPayload(`
			4
			0:.:1:235
			8fe06d81f43e6db3fba959cfe1b4073544b4e2189b21345acbc5281b7c569e52:0:19a1f171-01d1-4c80-8bff-964a79dc90b8:2:235
		`.trim().replace(/\t+/g, ''))
	)

	const apiFolder = new ApiFolder(
		root,
		root.hashEntries.hashEntriesList[0],
		HashEntriesFactory.fromPayload(`
			4
			0:19a1f171-01d1-4c80-8bff-964a79dc90b8:2:235
			eb7f84af0dbbe34565fc540855c36ce0727494dc1d445e52f3cc4200948a3a8b:0:19a1f171-01d1-4c80-8bff-964a79dc90b8.content:0:24
			5cfa025bd3e9cf107c41a850be61908cfcff76a674c208cb9a8d11d46c3d31be:0:19a1f171-01d1-4c80-8bff-964a79dc90b8.metadata:0:211
		`.trim().replace(/\t+/g, '')),
		{
			createdTime: "1736704977319",
			lastModified: "1736704977319",
			parent: "4c6b5473-f424-4f18-88b3-e94051b7457b",
			pinned: false,
			type: "CollectionType",
			visibleName: "Crystal"
		}
	)

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
					folderMetadataPayload: JSON.stringify(apiFolder.metadata.payload)
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
	// 	it('returns a snapshot of reMarkable cloud account attached to session', async () => {
	// 		const session = global.remarkableApiSession
	//
	// 		const snapshot = await Snapshot.fromSession(session)
	//
	// 		expect(snapshot).toBeInstanceOf(Snapshot)
	// 		expect(snapshot.root).toBeDefined()
	// 		expect(snapshot.documents).toBeInstanceOf(Array)
	// 		expect(snapshot.folders).toBeInstanceOf(Array)
	// 		expect(snapshot.documents.length).toBeGreaterThan(0)
	// 		expect(snapshot.documents[0]).toBeInstanceOf(Document)
	// 		expect(snapshot.folders[0]).toBeInstanceOf(Folder)
	// 	}, 100000000)
	// })

	describe('#toJson', () => {
		it('returns JSON representation of the snapshot', () => {
			const snapshot = new Snapshot(root, [], [new Folder(apiFolder)])

			expect(snapshot.toJson).toEqual({
				rootChecksum: root.checksum,
				rootGeneration: root.generation,
				rootHashEntriesPayload: root.hashEntries.payload,
				documents: [],
				folders: [{
					folderRootHashEntryPayload: apiFolder.rootHashEntry.payload,
					folderHashEntriesPayload: apiFolder.hashEntries.payload,
					folderMetadataPayload: JSON.stringify(apiFolder.metadata.payload)
				}]
			})
		})
	})
})
