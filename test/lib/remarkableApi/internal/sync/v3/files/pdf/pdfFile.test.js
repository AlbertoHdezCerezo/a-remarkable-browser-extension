import {setupHttpRecording} from '../../../../../../../helpers/pollyHelper'
import Device from '../../../../../../../../src/lib/remarkableApi/internal/token/device.js'
import Session from '../../../../../../../../src/lib/remarkableApi/internal/token/session.js'
import Root from '../../../../../../../../src/lib/remarkableApi/internal/sync/root'
import PdfFile, {
	PdfIncompatibleHashEntriesError
} from '../../../../../../../../src/lib/remarkableApi/internal/sync/v3/files/pdf/pdfFile'
import {
	HashEntriesFactory,
	HashEntryFactory
} from '../../../../../../../../src/lib/remarkableApi/internal/schemas/index'

describe('PdfFile', () => {
	setupHttpRecording()

	describe('.fromHashEntry', () => {
		it('returns PDF file from root PDF file hash entry', async () => {
			const session = global.remarkableApiSession
			const root = await Root.fromSession(session)
			const pdfHashEntry = HashEntryFactory.fromPayload(global.samplePdfHashEntryPayload)
			const pdfHashEntriesPayload = await pdfHashEntry.content(session)
			const pdfHashEntries = HashEntriesFactory.fromPayload(pdfHashEntriesPayload)
			const epubHashEntry = HashEntryFactory.fromPayload(global.sampleEpubHashEntryPayload)
			const epubHashEntriesPayload = await epubHashEntry.content(session)
			const epubHashEntries = HashEntriesFactory.fromPayload(epubHashEntriesPayload)

			await PdfFile.fromHashEntry(root, pdfHashEntry, session)
		})

		it('if root hash entry does not represent a PDF file, throws an error', async () => {
			const session = global.remarkableApiSession
			const root = await Root.fromSession(session)
			const pdfHashEntry = HashEntryFactory.fromPayload(global.samplePdfHashEntryPayload)
			const pdfHashEntriesPayload = await pdfHashEntry.content(session)
			const pdfHashEntries = HashEntriesFactory.fromPayload(pdfHashEntriesPayload)
			const epubHashEntry = HashEntryFactory.fromPayload(global.sampleEpubHashEntryPayload)
			const epubHashEntriesPayload = await epubHashEntry.content(session)
			const epubHashEntries = HashEntriesFactory.fromPayload(epubHashEntriesPayload)

			try {
				await PdfFile.fromHashEntry(root, pdfHashEntry, session)
			} catch (error) {
				expect(error instanceof PdfIncompatibleHashEntriesError).toBe(true)
			}
		})
	})

	describe('.fromHashEntries', () => {
		it('returns PDF file from provided hash entries', async () => {
			const session = global.remarkableApiSession
			const root = await Root.fromSession(session)
			const pdfHashEntry = HashEntryFactory.fromPayload(global.samplePdfHashEntryPayload)
			const pdfHashEntriesPayload = await pdfHashEntry.content(session)
			const pdfHashEntries = HashEntriesFactory.fromPayload(pdfHashEntriesPayload)
			const epubHashEntry = HashEntryFactory.fromPayload(global.sampleEpubHashEntryPayload)
			const epubHashEntriesPayload = await epubHashEntry.content(session)
			const epubHashEntries = HashEntriesFactory.fromPayload(epubHashEntriesPayload)

			await PdfFile.fromHashEntries(root, pdfHashEntry, pdfHashEntries, session)
		})

		it('if provided hash entries do not represent a PDF file, throws an error', async () => {
			const session = global.remarkableApiSession
			const root = await Root.fromSession(session)
			const pdfHashEntry = HashEntryFactory.fromPayload(global.samplePdfHashEntryPayload)
			const pdfHashEntriesPayload = await pdfHashEntry.content(session)
			const pdfHashEntries = HashEntriesFactory.fromPayload(pdfHashEntriesPayload)
			const epubHashEntry = HashEntryFactory.fromPayload(global.sampleEpubHashEntryPayload)
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
		it('if given hash entries resemble a reMarkable PDF file, returns true', async () => {
			const session = global.remarkableApiSession
			const root = await Root.fromSession(session)
			const pdfHashEntry = HashEntryFactory.fromPayload(global.samplePdfHashEntryPayload)
			const pdfHashEntriesPayload = await pdfHashEntry.content(session)
			const pdfHashEntries = HashEntriesFactory.fromPayload(pdfHashEntriesPayload)
			const epubHashEntry = HashEntryFactory.fromPayload(global.sampleEpubHashEntryPayload)
			const epubHashEntriesPayload = await epubHashEntry.content(session)
			const epubHashEntries = HashEntriesFactory.fromPayload(epubHashEntriesPayload)

			expect(PdfFile.compatibleWithHashEntries(pdfHashEntries)).toBe(true)
		})

		it('if given hash entries do not resemble a reMarkable PDF file, returns false', async () => {
			const session = global.remarkableApiSession
			const root = await Root.fromSession(session)
			const pdfHashEntry = HashEntryFactory.fromPayload(global.samplePdfHashEntryPayload)
			const pdfHashEntriesPayload = await pdfHashEntry.content(session)
			const pdfHashEntries = HashEntriesFactory.fromPayload(pdfHashEntriesPayload)
			const epubHashEntry = HashEntryFactory.fromPayload(global.sampleEpubHashEntryPayload)
			const epubHashEntriesPayload = await epubHashEntry.content(session)
			const epubHashEntries = HashEntriesFactory.fromPayload(global.epubHashEntriesPayload)
			expect(PdfFile.compatibleWithHashEntries(epubHashEntries)).toBe(false)
		})
	})

	describe('#rename', () => {
		it('updates the file name', async () => {
			const session = global.remarkableApiSession
			const root = await Root.fromSession(session)
			const pdfHashEntry = HashEntryFactory.fromPayload(global.samplePdfHashEntryPayload)
			const pdfHashEntriesPayload = await pdfHashEntry.content(session)
			const pdfHashEntries = HashEntriesFactory.fromPayload(pdfHashEntriesPayload)
			const epubHashEntry = HashEntryFactory.fromPayload(global.sampleEpubHashEntryPayload)
			const epubHashEntriesPayload = await epubHashEntry.content(session)
			const epubHashEntries = HashEntriesFactory.fromPayload(epubHashEntriesPayload)
			const newName = 'a-remarkable-web-browser-pdf-file-renamed.pdf'
			const newPdfFile = await pdfFile.rename(newName, session)
			expect(newPdfFile).toBeInstanceOf(PdfFile)
			expect(newPdfFile.name).toBe(newName)
		})
	})

	describe('#moveToFolder', () => {
		it('moves the PDF file to another folder', async () => {
			const session = global.remarkableApiSession
			const root = await Root.fromSession(session)
			const pdfHashEntry = HashEntryFactory.fromPayload(global.samplePdfHashEntryPayload)
			const pdfHashEntriesPayload = await pdfHashEntry.content(session)
			const pdfHashEntries = HashEntriesFactory.fromPayload(pdfHashEntriesPayload)
			const epubHashEntry = HashEntryFactory.fromPayload(global.sampleEpubHashEntryPayload)
			const epubHashEntriesPayload = await epubHashEntry.content(session)
			const epubHashEntries = HashEntriesFactory.fromPayload(epubHashEntriesPayload)
			const pdfFile = await PdfFile.fromHashEntry(root, pdfHashEntry, session)
			const movedPdfFile = await pdfFile.moveToFolder('trash')
			expect(movedPdfFile).toBeInstanceOf(PdfFile)
			expect(movedPdfFile.metadata.folderId).toBe('trash')
		})
	})
})
