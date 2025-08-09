import { jest } from '@jest/globals'
import {setupHttpRecording} from '../../../../../helpers/pollyHelper'
import Device from '../../../../../../src/lib/remarkableApi/internal/token/device.js'
import Session from '../../../../../../src/lib/remarkableApi/internal/token/session.js'
import Root from '../../../../../../src/lib/remarkableApi/internal/sync/root'
import {HashEntriesFactory} from '../../../../../../src/lib/remarkableApi/internal/schemas/index'
import PdfFile from '../../../../../../src/lib/remarkableApi/internal/sync/v3/files/pdf/pdfFile'
import EpubFile from '../../../../../../src/lib/remarkableApi/internal/sync/v3/files/epub/epubFile'
import FileFactory from '../../../../../../src/lib/remarkableApi/internal/sync/fileFactory'
import Folder from '../../../../../../src/lib/remarkableApi/internal/sync/v3/files/folder/folder'

describe('FileFactory', () => {
	setupHttpRecording()

	describe('.fileFromHashEntries', () => {
		it('if given a PDF file hash entries, returns a PdfFile instance', async () => {
			const deviceConnection = new Device(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			const root = await Root.fromSession(session)
			const pdfHashEntry = root.hashEntries.hashEntriesList.find(entry => entry.fileId === global.pdfFileId)
			const pdfHashEntriesPayload = await pdfHashEntry.content(session)
			const pdfHashEntries = HashEntriesFactory.fromPayload(pdfHashEntriesPayload)

			const pdfFile = await FileFactory.fileFromHashEntries(root, pdfHashEntry, pdfHashEntries, session)
			expect(pdfFile).toBeInstanceOf(PdfFile)
		})

		it('if given an EPUB file hash entries, returns an EpubFile instance', async () => {
			const deviceConnection = new Device(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			const root = await Root.fromSession(session)
			const epubHashEntry = root.hashEntries.hashEntriesList.find(entry => entry.fileId === global.epubFileId)
			const epubHashEntriesPayload = await epubHashEntry.content(session)
			const epubHashEntries = HashEntriesFactory.fromPayload(epubHashEntriesPayload)

			const epubFile = await FileFactory.fileFromHashEntries(root, epubHashEntry, epubHashEntries, session)
			expect(epubFile).toBeInstanceOf(EpubFile)
		})

		it('if given a folder hash entries, returns a Folder instance', async () => {
			const deviceConnection = new Device(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			const root = await Root.fromSession(session)
			const folderHashEntry = root.hashEntries.hashEntriesList.find(entry => entry.fileId === global.folderId)
			const folderHashEntriesPayload = await folderHashEntry.content(session)
			const folderHashEntries = HashEntriesFactory.fromPayload(folderHashEntriesPayload)

			const folderFile = await FileFactory.fileFromHashEntries(root, folderHashEntry, folderHashEntries, session)
			expect(folderFile).toBeInstanceOf(Folder)
		})
	})
})