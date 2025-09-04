import {Snapshot} from '../../../../src/lib/remarkableApi/cache/snapshot'
import {Folder} from '../../../../src/lib/remarkableApi/cache/folder'

describe('Snapshot', () => {
	const root = global.root
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
