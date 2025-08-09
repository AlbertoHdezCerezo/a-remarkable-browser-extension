import {setupHttpRecording} from '../../../../../../../helpers/pollyHelper'
import DeviceConnection from '../../../../../../../../src/lib/remarkableApi/deviceConnection'
import Session from '../../../../../../../../src/lib/remarkableApi/session'
import Root from '../../../../../../../../src/lib/remarkableApi/internal/sync/root'
import PdfFile, {
	PdfIncompatibleHashEntriesError
} from '../../../../../../../../src/lib/remarkableApi/internal/sync/v3/files/pdf/pdfFile'
import {HashEntriesFactory} from '../../../../../../../../src/lib/remarkableApi/internal/schemas/index'

describe('PdfFile', () => {
	setupHttpRecording()

	describe('.fromHashEntry', () => {
		it('returns PDF file from root PDF file hash entry', async () => {
			const deviceConnection = new DeviceConnection(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			const root = await Root.fromSession(session)
			const pdfHashEntry = root.hashEntries.hashEntriesList.find(entry => entry.fileId === global.pdfFileId)

			const pdfFile = await PdfFile.fromHashEntry(root, pdfHashEntry, session)
		})

		it('if root hash entry does not represent a PDF file, throws an error', async () => {
			const deviceConnection = new DeviceConnection(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			const root = await Root.fromSession(session)
			const pdfHashEntry = root.hashEntries.hashEntriesList.find(entry => entry.fileId === global.epubFileId)

			try {
				await PdfFile.fromHashEntry(root, pdfHashEntry, session)
			} catch (error) {
				expect(error instanceof PdfIncompatibleHashEntriesError).toBe(true)
			}
		})
	})

	describe('.fromHashEntries', () => {
		it('returns PDF file from provided hash entries', async () => {
			const deviceConnection = new DeviceConnection(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			const root = await Root.fromSession(session)
			const pdfHashEntry = root.hashEntries.hashEntriesList.find(entry => entry.fileId === global.pdfFileId)
			const pdfHashEntriesPayload = await pdfHashEntry.content(session)
			const pdfHashEntries = HashEntriesFactory.fromPayload(pdfHashEntriesPayload)

			const pdfFile = await PdfFile.fromHashEntries(root, pdfHashEntry, pdfHashEntries, session)
		})

		it('if provided hash entries do not represent a PDF file, throws an error', async () => {
			const deviceConnection = new DeviceConnection(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			const root = await Root.fromSession(session)
			const epubHashEntry = root.hashEntries.hashEntriesList.find(entry => entry.fileId === global.epubFileId)
			const epubHashEntriesPayload = await epubHashEntry.content(session)
			const epubHashEntries = HashEntriesFactory.fromPayload(epubHashEntriesPayload)

			try {
				await PdfFile.fromHashEntries(root, epubHashEntry, epubHashEntries, session)
			} catch (error) {
				expect(error instanceof PdfIncompatibleHashEntriesError).toBe(true)
			}
		})
	})

	describe('.compatibleWithHashEntries', () => {
		it('if given hash entries resemble a reMarkable PDF file, returns true', () => {
			const pdfHashEntries = HashEntriesFactory.fromPayload(global.pdfHashEntriesPayload)

			expect(PdfFile.compatibleWithHashEntries(pdfHashEntries)).toBe(true)
		})

		it('if given hash entries do not resemble a reMarkable PDF file, returns false', () => {
			const epubHashEntries = HashEntriesFactory.fromPayload(global.epubHashEntriesPayload)

			expect(PdfFile.compatibleWithHashEntries(epubHashEntries)).toBe(false)
		})
	})

	describe('.rename', () => {
		it('updates the file name', async () => {
			const deviceConnection = new DeviceConnection(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			const root = await Root.fromSession(session)
			const pdfHashEntry = root.hashEntries.hashEntriesList.find(entry => entry.fileId === global.pdfFileId)
			const pdfFile = await PdfFile.fromHashEntry(root, pdfHashEntry, session)

			const newName = 'New PDF Name'
			const newPdfFile = await pdfFile.rename(newName, session)

			expect(newPdfFile).toBeInstanceOf(PdfFile)
			expect(newPdfFile.name).toBe(newName)
		})
	})
})
