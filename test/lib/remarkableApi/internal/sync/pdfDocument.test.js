import DeviceConnection from '../../../../../src/lib/remarkableApi/deviceConnection'
import Session from '../../../../../src/lib/remarkableApi/session'
import HashEntries from '../../../../../src/lib/remarkableApi/internal/sync/hashEntries'
import PdfDocument, {PdfIncompatibleHashEntriesError} from '../../../../../src/lib/remarkableApi/internal/sync/pdfDocument'
import HashEntry from '../../../../../src/lib/remarkableApi/internal/sync/hashEntry'
import {setupHttpRecording} from '../../../../helpers/pollyHelper'

describe('PdfDocument', () => {
	setupHttpRecording()

	describe('.fromHashEntry', () => {
		it('if given PDF file hash entry, returns a PdfDocument', async () => {
			const hashEntry = new HashEntry(global.pdfRootHashEntryPayload)

			const session = await Session.from(new DeviceConnection(global.remarkableDeviceConnectionToken))

			const pdfDocument = await PdfDocument.fromHashEntry(hashEntry, session)

			expect(pdfDocument).toBeInstanceOf(PdfDocument)
		})

		it('if given non-PDF file hash entry, throws PdfIncompatibleHashEntriesError', async () => {
			const hashEntry = new HashEntry(global.epubRootHashEntryPayload)

			const session = await Session.from(new DeviceConnection(global.remarkableDeviceConnectionToken))

			await expect(PdfDocument.fromHashEntry(hashEntry, session)).rejects.toThrow(PdfIncompatibleHashEntriesError)
		})
	})

	describe('.fromHashEntriesResemblingAPdf', () => {
		it('if given hash entries resembles a PDF, returns a PdfDocument', async () => {
			const hashEntries = new HashEntries(global.pdfHashEntriesPayload)

			const session = await Session.from(new DeviceConnection(global.remarkableDeviceConnectionToken))

			const pdfDocument = await PdfDocument.fromHashEntriesResemblingAPdf(hashEntries, session)

			expect(pdfDocument).toBeInstanceOf(PdfDocument)
			expect(pdfDocument.fileId).toBe('0bacf12a-64fa-4fe5-9f28-16a043e8c809')
			expect(pdfDocument.hashEntries).toBe(hashEntries)
			expect(pdfDocument.metadata).toBeDefined()
		})

		it('if given hash entries does not resemble a PDF, throws PdfIncompatibleHashEntriesError', async () => {
			const hashEntries = new HashEntries(global.epubHashEntriesPayload)

			const session = await Session.from(new DeviceConnection(global.remarkableDeviceConnectionToken))

			await expect(PdfDocument.fromHashEntriesResemblingAPdf(hashEntries, session)).rejects.toThrow(PdfIncompatibleHashEntriesError)
		})
	})
})