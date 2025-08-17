import {setupHttpRecording} from '../../../../../../../helpers/pollyHelper'
import Device from '../../../../../../../../src/lib/remarkableApi/internal/token/device.js'
import Session from '../../../../../../../../src/lib/remarkableApi/internal/token/session.js'
import Root from '../../../../../../../../src/lib/remarkableApi/internal/sync/root'
import EpubFile, {
	EpubIncompatibleHashEntriesError
} from '../../../../../../../../src/lib/remarkableApi/internal/sync/v3/files/epub/epubFile'
import {
	HashEntriesFactory,
	HashEntryFactory
} from '../../../../../../../../src/lib/remarkableApi/internal/schemas/index'

describe('EpubFile', () => {
	setupHttpRecording()

	describe('.fromHashEntry', () => {
		it('returns ePub file from root ePub file hash entry', async () => {
			const session = global.remarkableApiSession
			const root = await Root.fromSession(session)
			const pdfHashEntry = HashEntryFactory.fromPayload(global.samplePdfHashEntryPayload)
			const pdfHashEntriesPayload = await pdfHashEntry.content(session)
			const pdfHashEntries = HashEntriesFactory.fromPayload(pdfHashEntriesPayload)
			const epubHashEntry = HashEntryFactory.fromPayload(global.sampleEpubHashEntryPayload)
			const epubHashEntriesPayload = await epubHashEntry.content(session)
			const epubHashEntries = HashEntriesFactory.fromPayload(epubHashEntriesPayload)

			await EpubFile.fromHashEntry(root, epubHashEntry, session)
		})

		it('if root hash entry does not represent a ePub file, throws an error', async () => {
			const session = global.remarkableApiSession
			const root = await Root.fromSession(session)
			const pdfHashEntry = HashEntryFactory.fromPayload(global.samplePdfHashEntryPayload)
			const pdfHashEntriesPayload = await pdfHashEntry.content(session)
			const pdfHashEntries = HashEntriesFactory.fromPayload(pdfHashEntriesPayload)
			const epubHashEntry = HashEntryFactory.fromPayload(global.sampleEpubHashEntryPayload)
			const epubHashEntriesPayload = await epubHashEntry.content(session)
			const epubHashEntries = HashEntriesFactory.fromPayload(epubHashEntriesPayload)

			try {
				await EpubFile.fromHashEntry(root, epubHashEntry, session)
			} catch (error) {
				expect(error instanceof EpubIncompatibleHashEntriesError).toBe(true)
			}
		})
	})

	describe('.fromHashEntries', () => {
		it('returns ePub file from provided hash entries', async () => {
			const session = global.remarkableApiSession
			const root = await Root.fromSession(session)
			const pdfHashEntry = HashEntryFactory.fromPayload(global.samplePdfHashEntryPayload)
			const pdfHashEntriesPayload = await pdfHashEntry.content(session)
			const pdfHashEntries = HashEntriesFactory.fromPayload(pdfHashEntriesPayload)
			const epubHashEntry = HashEntryFactory.fromPayload(global.sampleEpubHashEntryPayload)
			const epubHashEntriesPayload = await epubHashEntry.content(session)
			const epubHashEntries = HashEntriesFactory.fromPayload(epubHashEntriesPayload)

			await EpubFile.fromHashEntries(root, epubHashEntry, epubHashEntries, session)
		})

		it('if provided hash entries do not represent a ePub file, throws an error', async () => {
			const session = global.remarkableApiSession
			const root = await Root.fromSession(session)
			const pdfHashEntry = HashEntryFactory.fromPayload(global.samplePdfHashEntryPayload)
			const pdfHashEntriesPayload = await pdfHashEntry.content(session)
			const pdfHashEntries = HashEntriesFactory.fromPayload(pdfHashEntriesPayload)
			const epubHashEntry = HashEntryFactory.fromPayload(global.sampleEpubHashEntryPayload)
			const epubHashEntriesPayload = await epubHashEntry.content(session)
			const epubHashEntries = HashEntriesFactory.fromPayload(epubHashEntriesPayload)

			try {
				await EpubFile.fromHashEntries(root, pdfHashEntry, pdfHashEntries, session)
			} catch (error) {
				expect(error instanceof EpubIncompatibleHashEntriesError).toBe(true)
			}
		})
	})

	describe('.compatibleWithHashEntries', () => {
		it('returns true if hash entries resemble a reMarkable ePub file', async () => {
			const session = global.remarkableApiSession
			const root = await Root.fromSession(session)
			const pdfHashEntry = HashEntryFactory.fromPayload(global.samplePdfHashEntryPayload)
			const pdfHashEntriesPayload = await pdfHashEntry.content(session)
			const pdfHashEntries = HashEntriesFactory.fromPayload(pdfHashEntriesPayload)
			const epubHashEntry = HashEntryFactory.fromPayload(global.sampleEpubHashEntryPayload)
			const epubHashEntriesPayload = await epubHashEntry.content(session)
			const epubHashEntries = HashEntriesFactory.fromPayload(epubHashEntriesPayload)

			expect(EpubFile.compatibleWithHashEntries(epubHashEntries)).toBe(true)
		})

		it('returns false if hash entries do not resemble a reMarkable ePub file', async () => {
			const session = global.remarkableApiSession
			const root = await Root.fromSession(session)
			const pdfHashEntry = HashEntryFactory.fromPayload(global.samplePdfHashEntryPayload)
			const pdfHashEntriesPayload = await pdfHashEntry.content(session)
			const pdfHashEntries = HashEntriesFactory.fromPayload(pdfHashEntriesPayload)
			const epubHashEntry = HashEntryFactory.fromPayload(global.sampleEpubHashEntryPayload)
			const epubHashEntriesPayload = await epubHashEntry.content(session)
			const epubHashEntries = HashEntriesFactory.fromPayload(epubHashEntriesPayload)

			expect(EpubFile.compatibleWithHashEntries(pdfHashEntries)).toBe(false)
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
			const epubFile = await EpubFile.fromHashEntry(root, epubHashEntry, session)
			const newName = 'a-remarkable-web-browser-renamed-epub-file-renamed.epub'
			const newEpubFile = await epubFile.rename(newName, session)

			expect(newEpubFile).toBeInstanceOf(EpubFile)
			expect(newEpubFile.name).toBe(newName)
		})
	})

	describe('#moveToFolder', () => {
		it('moves the ePub file to another folder', async () => {
			const session = global.remarkableApiSession
			const root = await Root.fromSession(session)
			const pdfHashEntry = HashEntryFactory.fromPayload(global.samplePdfHashEntryPayload)
			const pdfHashEntriesPayload = await pdfHashEntry.content(session)
			const pdfHashEntries = HashEntriesFactory.fromPayload(pdfHashEntriesPayload)
			const epubHashEntry = HashEntryFactory.fromPayload(global.sampleEpubHashEntryPayload)
			const epubHashEntriesPayload = await epubHashEntry.content(session)
			const epubHashEntries = HashEntriesFactory.fromPayload(epubHashEntriesPayload)
			const epubFile = await EpubFile.fromHashEntry(root, epubHashEntry, session)
			const movedEpubFile = await epubFile.moveToFolder('trash', session)

			expect(movedEpubFile).toBeInstanceOf(EpubFile)
			expect(movedEpubFile.metadata.folderId).toBe('trash')
		})
	})
})
