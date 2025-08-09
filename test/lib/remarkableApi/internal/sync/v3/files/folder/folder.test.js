import {setupHttpRecording} from '../../../../../../../helpers/pollyHelper'
import Device from '../../../../../../../../src/lib/remarkableApi/internal/token/device.js'
import Session from '../../../../../../../../src/lib/remarkableApi/internal/token/session.js'
import Root from '../../../../../../../../src/lib/remarkableApi/internal/sync/root'
import {HashEntriesFactory} from '../../../../../../../../src/lib/remarkableApi/internal/schemas/index'
import Folder, {
	FolderIncompatibleHashEntriesError
} from '../../../../../../../../src/lib/remarkableApi/internal/sync/v3/files/folder/folder'

describe('Folder', () => {
	setupHttpRecording()

	describe('.create', () => {
		it('creates a new folder', async () => {
			const deviceConnection = new Device(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			const root = await Root.fromSession(session)
			const folderName = 'Test Folder'
			const newFolder = await Folder.create(root, folderName, session)

			expect(newFolder).toBeInstanceOf(Folder)
			expect(newFolder.name).toBe(folderName)
		})
	})

	describe('.fromHashEntry', () => {
		it('returns folder from root folder hash entry', async () => {
			const deviceConnection = new Device(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			const root = await Root.fromSession(session)
			const folderHashEntry = root.hashEntries.hashEntriesList.find(entry => entry.fileId === global.folderId)

			const folder = await Folder.fromHashEntry(root, folderHashEntry, session)
		})

		it('if root hash entry does not represent a folder, throws an error', async () => {
			const deviceConnection = new Device(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			const root = await Root.fromSession(session)
			const folderHashEntry = root.hashEntries.hashEntriesList.find(entry => entry.fileId === global.folderId)

			try {
				await Folder.fromHashEntry(root, folderHashEntry, session)
			} catch (error) {
				expect(error instanceof FolderIncompatibleHashEntriesError).toBe(true)
			}
		})
	})

	describe('.fromHashEntries', () => {
		it('returns folder from provided hash entries', async () => {
			const deviceConnection = new Device(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			const root = await Root.fromSession(session)
			const folderHashEntry = root.hashEntries.hashEntriesList.find(entry => entry.fileId === global.folderId)
			const folderHashEntriesPayload = await folderHashEntry.content(session)
			const folderHashEntries = HashEntriesFactory.fromPayload(folderHashEntriesPayload)

			const folder = await Folder.fromHashEntries(root, folderHashEntry, folderHashEntries, session)
		})

		it('if provided hash entries do not represent a folder, throws an error', async () => {
			const deviceConnection = new Device(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			const root = await Root.fromSession(session)
			const folderHashEntry = root.hashEntries.hashEntriesList.find(entry => entry.fileId === global.folderId)
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
			const folderHashEntries = HashEntriesFactory.fromPayload(global.folderHashEntriesPayload)

			expect(Folder.compatibleWithHashEntries(folderHashEntries)).toBe(true)
		})

		it('if given hash entries do not resemble a reMarkable folder, returns false', () => {
			const folderHashEntries = HashEntriesFactory.fromPayload(global.folderHashEntriesPayload)

			expect(Folder.compatibleWithHashEntries(folderHashEntries)).toBe(false)
		})
	})

	describe('#rename', () => {
		it('updates the folder name', async () => {
			const deviceConnection = new Device(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			const root = await Root.fromSession(session)
			const folderHashEntry = root.hashEntries.hashEntriesList.find(entry => entry.fileId === global.folderId)
			const folderFile = await Folder.fromHashEntry(root, folderHashEntry, session)

			const newName = 'New Folder Name'
			const newFolderFile = await folderFile.rename(newName, session)

			expect(newFolderFile).toBeInstanceOf(Folder)
			expect(newFolderFile.name).toBe(newName)
		})
	})

	describe('#moveToFolder', () => {
		it('moves the ePub file to another folder', async () => {
			const deviceConnection = new Device(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			const root = await Root.fromSession(session)
			const folderHashEntry = root.hashEntries.hashEntriesList.find(entry => entry.fileId === global.folderId)
			const folderFile = await Folder.fromHashEntry(root, folderHashEntry, session)

			const movedFolderFile = await folderFile.moveToFolder('')

			expect(movedFolderFile).toBeInstanceOf(Folder)
			expect(movedFolderFile.metadata.folderId).toBe('')
		})
	})

	describe('#moveToTrash', () => {
		it('moves the PDF file to trash', async () => {
			const deviceConnection = new Device(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			const root = await Root.fromSession(session)
			const folderHashEntry = root.hashEntries.hashEntriesList.find(entry => entry.fileId === global.folderId)
			const folderFile = await Folder.fromHashEntry(root, folderHashEntry, session)

			const trashedFolderFile = await folderFile.moveToTrash(session)

			expect(trashedFolderFile).toBeInstanceOf(Folder)
			expect(trashedFolderFile.metadata.folderId).toBe('trash')
		})
	})
})