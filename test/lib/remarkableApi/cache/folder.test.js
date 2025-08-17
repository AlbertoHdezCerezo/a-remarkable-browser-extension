import Root from '../../../../src/lib/remarkableApi/internal/sync/root'
import ApiFolder from '../../../../src/lib/remarkableApi/internal/sync/v3/files/folder/folder'
import {HashEntriesFactory} from '../../../../src/lib/remarkableApi/internal/schemas/index'
import Folder from '../../../../src/lib/remarkableApi/cache/folder'

describe('Folder', () => {
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
		it('from a folder JSON, returns Folder instance', () => {
			const folderJson = JSON.stringify(
				{
					folderRootHashEntryPayload: apiFolder.rootHashEntry.payload,
					folderHashEntriesPayload: apiFolder.hashEntries.payload,
					folderMetadataPayload: JSON.stringify(apiFolder.metadata.payload)
				}
			)

			const folder = Folder.fromJson(folderJson, root)

			expect(folder).toBeInstanceOf(Folder)
			expect(folder.apiFolder).toBeInstanceOf(ApiFolder)
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
