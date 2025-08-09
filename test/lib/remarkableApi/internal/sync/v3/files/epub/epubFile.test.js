import {setupHttpRecording} from '../../../../../../../helpers/pollyHelper'
import DeviceConnection from '../../../../../../../../src/lib/remarkableApi/deviceConnection'
import Session from '../../../../../../../../src/lib/remarkableApi/session'
import Root from '../../../../../../../../src/lib/remarkableApi/internal/sync/root'
import EpubFile, {
	EpubIncompatibleHashEntriesError
} from '../../../../../../../../src/lib/remarkableApi/internal/sync/v3/files/epub/epubFile'
import {HashEntriesFactory} from '../../../../../../../../src/lib/remarkableApi/internal/schemas/index'

describe('EpubFile', () => {
	setupHttpRecording()

	describe('.fromHashEntry', () => {
		it('returns ePub file from root ePub file hash entry', async () => {
			const deviceConnection = new DeviceConnection(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			const root = await Root.fromSession(session)
			const epubHashEntry = root.hashEntries.hashEntriesList.find(entry => entry.fileId === global.epubFileId)

			await EpubFile.fromHashEntry(root, epubHashEntry, session)
		})

		it('if root hash entry does not represent a ePub file, throws an error', async () => {
			const deviceConnection = new DeviceConnection(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			const root = await Root.fromSession(session)
			const epubHashEntry = root.hashEntries.hashEntriesList.find(entry => entry.fileId === global.pdfFileId)

			try {
				await EpubFile.fromHashEntry(root, epubHashEntry, session)
			} catch (error) {
				expect(error instanceof EpubIncompatibleHashEntriesError).toBe(true)
			}
		})
	})

	describe('.fromHashEntries', () => {
		it('returns ePub file from provided hash entries', async () => {
			const deviceConnection = new DeviceConnection(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			const root = await Root.fromSession(session)
			const epubHashEntry = root.hashEntries.hashEntriesList.find(entry => entry.fileId === global.epubFileId)
			const epubHashEntriesPayload = await epubHashEntry.content(session)

			const epubHashEntries = HashEntriesFactory.fromPayload(epubHashEntriesPayload)

			await EpubFile.fromHashEntries(root, epubHashEntry, epubHashEntries, session)
		})

		it('if provided hash entries do not represent a ePub file, throws an error', async () => {
			const deviceConnection = new DeviceConnection(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			const root = await Root.fromSession(session)
			const pdfHashEntry = root.hashEntries.hashEntriesList.find(entry => entry.fileId === global.pdfFileId)
			const pdfHashEntriesPayload = await pdfHashEntry.content(session)
			const pdfHashEntries = HashEntriesFactory.fromPayload(pdfHashEntriesPayload)

			try {
				await EpubFile.fromHashEntries(root, pdfHashEntry, pdfHashEntries, session)
			} catch (error) {
				expect(error instanceof EpubIncompatibleHashEntriesError).toBe(true)
			}
		})
	})

	describe('.compatibleWithHashEntries', () => {
		it('returns true if hash entries resemble a reMarkable ePub file', () => {
			const epubHashEntries = HashEntriesFactory.fromPayload(global.epubHashEntriesPayload)

			expect(EpubFile.compatibleWithHashEntries(epubHashEntries)).toBe(true)
		})

		it('returns false if hash entries do not resemble a reMarkable ePub file', () => {
			const pdfHashEntries = HashEntriesFactory.fromPayload(global.pdfHashEntriesPayload)

			expect(EpubFile.compatibleWithHashEntries(pdfHashEntries)).toBe(false)
		})
	})

	describe('#rename', () => {
		it('updates the file name', async () => {
			const deviceConnection = new DeviceConnection(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			const root = await Root.fromSession(session)
			const epubHashEntry = root.hashEntries.hashEntriesList.find(entry => entry.fileId === global.epubFileId)
			const epubFile = await EpubFile.fromHashEntry(root, epubHashEntry, session)

			const newName = 'New ePub Name'
			const newEpubFile = await epubFile.rename(newName, session)

			expect(newEpubFile).toBeInstanceOf(EpubFile)
			expect(newEpubFile.name).toBe(newName)
		})
	})

	describe('#moveToFolder', () => {
		it('moves the ePub file to another folder', async () => {
			const deviceConnection = new DeviceConnection(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			const root = await Root.fromSession(session)
			const epubHashEntry = root.hashEntries.hashEntriesList.find(entry => entry.fileId === global.epubFileId)
			const epubFile = await EpubFile.fromHashEntry(root, epubHashEntry, session)

			const movedEpubFile = await epubFile.moveToFolder('')

			expect(movedEpubFile).toBeInstanceOf(EpubFile)
			expect(movedEpubFile.metadata.folderId).toBe('')
		})
	})

	describe('#moveToTrash', () => {
		it('moves the PDF file to trash', async () => {
			const deviceConnection = new DeviceConnection(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			const root = await Root.fromSession(session)
			const epubHashEntry = root.hashEntries.hashEntriesList.find(entry => entry.fileId === global.epubFileId)
			const epubFile = await EpubFile.fromHashEntry(root, epubHashEntry, session)

			const trashedEpubFile = await epubFile.moveToTrash(session)

			expect(trashedEpubFile).toBeInstanceOf(EpubFile)
			expect(trashedEpubFile.metadata.folderId).toBe('trash')
		})
	})
})
