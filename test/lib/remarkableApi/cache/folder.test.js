import {Folder} from '../../../../src/lib/remarkableApi/cache/folder'
import * as Sync from '../../../../src/lib/remarkableApi/internal/sync'

describe('Folder', () => {
	const root = global.root
	const apiFolder = global.folder

	describe('.fromJson', () => {
		it('from a folder JSON, returns Folder instance', () => {
			const folderJson = JSON.stringify(
				{
					folderRootHashEntryPayload: apiFolder.rootHashEntry.payload,
					folderHashEntriesPayload: apiFolder.hashEntries.payload,
					folderMetadataPayload: JSON.stringify(apiFolder.metadata.payload)
				}
			)

			const folder = Sync.V3.Folder.fromJson(folderJson, root)

			expect(folder).toBeInstanceOf(Folder)
			expect(folder.apiFolder).toBeInstanceOf(Sync.V3.Folder)
			expect(folder.apiFolder.root.hashEntries.payload).toBe(root.hashEntries.payload)
			expect(folder.apiFolder.hashEntries.payload).toBe(apiFolder.hashEntries.payload)
			expect(folder.apiFolder.rootHashEntry.payload).toBe(apiFolder.rootHashEntry.payload)
		})
	})

	describe('#toJson', () => {
		it('from a folder, dumps document to JSON string', () => {
			const folder = new Folder(apiFolder)

			expect(folder.toJson).toEqual({
				folderRootHashEntryPayload: apiFolder.rootHashEntry.payload,
				folderHashEntriesPayload: apiFolder.hashEntries.payload,
				folderMetadataPayload: JSON.stringify(apiFolder.metadata.payload)
			})
		})
	})
})
