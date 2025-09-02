import {setupHttpRecording} from '../../../../../../../helpers/pollyHelper'
import {Root} from '../../../../../../../../src/lib/remarkableApi/internal/sync/root'
import {HashEntriesFactory} from '../../../../../../../../src/lib/remarkableApi/internal/schemas/index'
import {
	Folder,
	FolderIncompatibleHashEntriesError
} from '../../../../../../../../src/lib/remarkableApi/internal/sync/v3/files/folder/folder'

describe('Folder', () => {
	setupHttpRecording()

	describe('.create', () => {
		it('creates a new folder', async () => {
			const session = global.remarkableApiSession
			const root = await Root.fromSession(session)
			const folderHashEntry = HashEntriesFactory.fromPayload(global.sampleFolderHashEntryPayload)
			const folderHashEntriesPayload = await folderHashEntry.content(session)
			const folderHashEntries = HashEntriesFactory.fromPayload(folderHashEntriesPayload)
			const folderName = 'a-remarkable-web-browser-folder-test'
			const newFolder = await Folder.create(root, folderName, session)

			expect(newFolder).toBeInstanceOf(Folder)
			expect(newFolder.name).toBe(folderName)
		})
	})

	describe('.fromHashEntry', () => {
		it('returns folder from root folder hash entry', async () => {
			const session = global.remarkableApiSession
			const root = await Root.fromSession(session)
			const folderHashEntry = HashEntriesFactory.fromPayload(global.sampleFolderHashEntryPayload)
			const folderHashEntriesPayload = await folderHashEntry.content(session)
			const folderHashEntries = HashEntriesFactory.fromPayload(folderHashEntriesPayload)
			await Folder.fromHashEntry(root, folderHashEntry, session)
		})

		it('if root hash entry does not represent a folder, throws an error', async () => {
			const session = global.remarkableApiSession
			const root = await Root.fromSession(session)
			const folderHashEntry = HashEntriesFactory.fromPayload(global.sampleFolderHashEntryPayload)
			const folderHashEntriesPayload = await folderHashEntry.content(session)
			const folderHashEntries = HashEntriesFactory.fromPayload(folderHashEntriesPayload)

			try {
				await Folder.fromHashEntry(root, folderHashEntry, session)
			} catch (error) {
				expect(error instanceof FolderIncompatibleHashEntriesError).toBe(true)
			}
		})
	})

	describe('.fromHashEntries', () => {
		it('returns folder from provided hash entries', async () => {
			const session = global.remarkableApiSession
			const root = await Root.fromSession(session)
			const folderHashEntry = HashEntriesFactory.fromPayload(global.sampleFolderHashEntryPayload)
			const folderHashEntriesPayload = await folderHashEntry.content(session)
			const folderHashEntries = HashEntriesFactory.fromPayload(folderHashEntriesPayload)

			await Folder.fromHashEntries(root, folderHashEntry, folderHashEntries, session)
		})

		it('if provided hash entries do not represent a folder, throws an error', async () => {
			const session = global.remarkableApiSession
			const root = await Root.fromSession(session)
			const folderHashEntry = HashEntriesFactory.fromPayload(global.sampleFolderHashEntryPayload)
			const folderHashEntriesPayload = await folderHashEntry.content(session)
			const folderHashEntries = HashEntriesFactory.fromPayload(folderHashEntriesPayload)

			try {
				await Folder.fromHashEntries(root, folderHashEntry, folderHashEntries, session)
			} catch (error) {
				expect(error instanceof FolderIncompatibleHashEntriesError).toBe(true)
			}
		})
	})

	describe('.compatibleWithHashEntries', () => {
		it('if given hash entries resemble a reMarkable folder, returns true', () => {
			expect(Folder.compatibleWithHashEntries(folderHashEntries)).toBe(true)
		})

		it('if given hash entries do not resemble a reMarkable folder, returns false', () => {
			expect(Folder.compatibleWithHashEntries(folderHashEntries)).toBe(false)
		})
	})

	describe('#rename', () => {
		it('updates the folder name', async () => {
			const session = global.remarkableApiSession
			const root = await Root.fromSession(session)
			const folderHashEntry = HashEntriesFactory.fromPayload(global.sampleFolderHashEntryPayload)
			const folderHashEntriesPayload = await folderHashEntry.content(session)
			const folderHashEntries = HashEntriesFactory.fromPayload(folderHashEntriesPayload)
			const folderFile = await Folder.fromHashEntry(root, folderHashEntry, session)
			const newName = 'a-remarkable-web-browser-folder-renamed'
			const newFolderFile = await folderFile.rename(newName, session)

			expect(newFolderFile).toBeInstanceOf(Folder)
			expect(newFolderFile.name).toBe(newName)
		})
	})

	describe('#moveToFolder', () => {
		it('moves the ePub file to another folder', async () => {
			const session = global.remarkableApiSession
			const root = await Root.fromSession(session)
			const folderHashEntry = HashEntriesFactory.fromPayload(global.sampleFolderHashEntryPayload)
			const folderHashEntriesPayload = await folderHashEntry.content(session)
			const folderHashEntries = HashEntriesFactory.fromPayload(folderHashEntriesPayload)
			const folderFile = await Folder.fromHashEntry(root, folderHashEntry, session)
			const movedFolderFile = await folderFile.moveToFolder('')

			expect(movedFolderFile).toBeInstanceOf(Folder)
			expect(movedFolderFile.metadata.folderId).toBe('trash')
		})
	})
})