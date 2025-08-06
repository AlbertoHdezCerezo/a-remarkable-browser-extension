import {setupHttpRecording} from '../../../../../../../helpers/pollyHelper'
import DeviceConnection from '../../../../../../../../src/lib/remarkableApi/deviceConnection'
import Session from '../../../../../../../../src/lib/remarkableApi/session'
import Root from '../../../../../../../../src/lib/remarkableApi/internal/sync/root'
import {HashEntriesFactory} from '../../../../../../../../src/lib/remarkableApi/internal/schemas/index'
import Folder, {
	FolderIncompatibleHashEntriesError
} from '../../../../../../../../src/lib/remarkableApi/internal/sync/v3/files/folder/folder'

describe('Folder', () => {
	setupHttpRecording()

	describe('.fromHashEntry', () => {
		it('returns folder from root folder hash entry', async () => {
			const deviceConnection = new DeviceConnection(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			const root = await Root.fromSession(session)
			const folderHashEntry = root.hashEntries.hashEntriesList.find(entry => entry.fileId === global.folderId)

			const folder = await Folder.fromHashEntry(root, folderHashEntry, session)
		})

		it('if root hash entry does not represent a folder, throws an error', async () => {
			const deviceConnection = new DeviceConnection(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			const root = await Root.fromSession(session)
			const epubHashEntry = root.hashEntries.hashEntriesList.find(entry => entry.fileId === global.epubFileId)

			try {
				await Folder.fromHashEntry(root, epubHashEntry, session)
			} catch (error) {
				expect(error instanceof FolderIncompatibleHashEntriesError).toBe(true)
			}
		})
	})

	describe('.fromHashEntries', () => {
		it('returns folder from provided hash entries', async () => {
			const deviceConnection = new DeviceConnection(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			const root = await Root.fromSession(session)
			const folderHashEntry = root.hashEntries.hashEntriesList.find(entry => entry.fileId === global.folderId)
			const folderHashEntriesPayload = await folderHashEntry.content(session)
			const folderHashEntries = HashEntriesFactory.fromPayload(folderHashEntriesPayload)

			const folder = await Folder.fromHashEntries(root, folderHashEntry, folderHashEntries, session)
		})

		it('if provided hash entries do not represent a folder, throws an error', async () => {
			const deviceConnection = new DeviceConnection(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			const root = await Root.fromSession(session)
			const epubHashEntry = root.hashEntries.hashEntriesList.find(entry => entry.fileId === global.epubFileId)
			const epubHashEntriesPayload = await epubHashEntry.content(session)
			const epubHashEntries = HashEntriesFactory.fromPayload(epubHashEntriesPayload)

			try {
				await Folder.fromHashEntries(root, epubHashEntry, epubHashEntries, session)
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
			const epubHashEntries = HashEntriesFactory.fromPayload(global.epubHashEntriesPayload)

			expect(Folder.compatibleWithHashEntries(epubHashEntries)).toBe(false)
		})
	})
})