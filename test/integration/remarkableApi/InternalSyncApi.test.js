import fs from 'fs'
import {expect} from '@jest/globals'
import {setupHttpRecording} from '../../helpers/pollyHelper.js'
import {FileBuffer} from '../../../src/lib/remarkableApi'
import {Upload} from '../../../src/lib/remarkableApi/internal/doc/v2'
import * as Sync from '../../../src/lib/remarkableApi/internal/sync'

describe('eu.tectonic.remarkable.com/sync/v3/root', () => {
	const session = global.remarkableApiSession
	const pdfFileBuffer = new FileBuffer(fs.readFileSync('./test/fixtures/documents/sample.pdf'))
	const ePubFileBuffer = new FileBuffer(fs.readFileSync('./test/fixtures/documents/sample.epub'))

	setupHttpRecording()

	describe('Root', () => {
		it('Load reMarkable Cloud Root & Hash Entries', async () => {
			const root = await Sync.V3.Root.fromSession(session)

			expect(root).toBeInstanceOf(Sync.V3.Root)
			expect(root.checksum).toBeDefined()
			expect(root.generation).toBeDefined()
			expect(root.hashEntries).toBeDefined()
			expect(root.hashEntries.hashEntriesList.length).toBeGreaterThan(0)
		}, 1000000000)
	})

	describe('Document', () => {
		it('loads a PDF document', async () => {
			const pdfFile = await Upload.document("test-document-load.pdf", pdfFileBuffer, session)
			const root = await Sync.V3.Root.fromSession(session)

			const pdfFileRootHashEntry = root.hashEntries.hashEntriesList.find((entry) => entry.checksum === pdfFile.rootHashEntry.checksum)
			const pdfFileFromRoot = await Sync.V3.Document.fromHashEntry(pdfFileRootHashEntry, session)

			expect(pdfFileFromRoot).toBeInstanceOf(Sync.V3.Document)
			expect(pdfFileFromRoot.name).toBe("test-document-load.pdf")
		}, 1000000000)

		it('loads an ePub document', async () => {
			const ePubFile = await Upload.document("test-document-load.epub", ePubFileBuffer, session)
			const root = await Sync.V3.Root.fromSession(session)

			const ePubFileRootHashEntry = root.hashEntries.hashEntriesList.find((entry) => entry.checksum === ePubFile.rootHashEntry.checksum)
			const ePubFileFromRoot = await Sync.V3.Document.fromHashEntry(ePubFileRootHashEntry, session)

			expect(ePubFileFromRoot).toBeInstanceOf(Sync.V3.Document)
			expect(ePubFileFromRoot.name).toBe("test-document-load.epub")
		}, 1000000000)

		it('renames a document', async () => {
			const pdfFile = await Upload.document("test-document-rename.pdf", pdfFileBuffer, session)
			await pdfFile.rename('test-document-renamed.pdf', session)

			const root = await Sync.V3.Root.fromSession(session)

			const pdfFileRootHashEntry = root.hashEntries.hashEntriesList.find((entry) => entry.checksum === pdfFile.rootHashEntry.checksum)
			const pdfFileFromRoot = await Sync.V3.Document.fromHashEntry(pdfFileRootHashEntry, session)

			expect(pdfFileFromRoot).toBeInstanceOf(Sync.V3.Document)
			expect(pdfFileFromRoot.name).toBe('test-document-renamed.pdf')
		}, 1000000000)

		it('moves document to a folder', async () => {
			const pdfFile = await Upload.document("test-document-move.pdf", pdfFileBuffer, session)
			await pdfFile.moveToTrash(session)

			const root = await Sync.V3.Root.fromSession(session)

			const pdfFileRootHashEntry = root.hashEntries.hashEntriesList.find((entry) => entry.checksum === pdfFile.rootHashEntry.checksum)
			const pdfFileFromRoot = await Sync.V3.Document.fromHashEntry(pdfFileRootHashEntry, session)

			expect(pdfFileFromRoot).toBeInstanceOf(Sync.V3.Document)
			expect(pdfFileFromRoot.name).toBe('test-document-move.pdf')
			expect(pdfFileFromRoot.metadata.folderId).toBe('trash')
		}, 1000000000)

		it('refreshes document', async () => {
			const pdfFile = await Upload.document("test-document-refresh.pdf", pdfFileBuffer, session)
			const root = await Sync.V3.Root.fromSession(session)
			const pdfFileRootHashEntry = root.hashEntries.hashEntriesList.find((entry) => entry.fileId === pdfFile.rootHashEntry.fileId)
			const pdfFileFromRoot = await Sync.V3.Document.fromHashEntry(pdfFileRootHashEntry, session)

			expect(pdfFileFromRoot).toBeInstanceOf(Sync.V3.Document)
			expect(pdfFile.name).toBe('test-document-refresh.pdf')

			await pdfFile.rename('test-document-refreshed.pdf', session)
			await pdfFileFromRoot.refresh(session)

			expect(pdfFileFromRoot.name).toBe('test-document-refreshed.pdf')
		}, 1000000000)
	})

	describe('Folder', () => {
		it('loads a folder', async () => {
			const folder = await Upload.folder('test-folder-load', session)
			const root = await Sync.V3.Root.fromSession(session)

			const folderRootHashEntry = root.hashEntries.hashEntriesList.find((entry) => entry.checksum === folder.rootHashEntry.checksum)
			const folderFromRoot = await Sync.V3.Folder.fromHashEntry(folderRootHashEntry, session)

			expect(folderFromRoot).toBeInstanceOf(Sync.V3.Folder)
			expect(folderFromRoot.name).toBe('test-folder-load')
		}, 1000000000)

		it('renames a folder', async () => {
			const folder = await Upload.folder('test-folder-rename', session)
			await folder.rename('test-folder-renamed', session)

			const root = await Sync.V3.Root.fromSession(session)

			const folderRootHashEntry = root.hashEntries.hashEntriesList.find((entry) => entry.checksum === folder.rootHashEntry.checksum)
			const folderFromRoot = await Sync.V3.Folder.fromHashEntry(folderRootHashEntry, session)

			expect(folderFromRoot).toBeInstanceOf(Sync.V3.Folder)
			expect(folderFromRoot.name).toBe('test-folder-renamed')
		}, 1000000000)

		it('moves folder to a folder', async () => {
			const folder = await Upload.folder('test-folder-move', session)
			await folder.moveToTrash(session)

			const root = await Sync.V3.Root.fromSession(session)

			const folderRootHashEntry = root.hashEntries.hashEntriesList.find((entry) => entry.checksum === folder.rootHashEntry.checksum)
			const folderFromRoot = await Sync.V3.Folder.fromHashEntry(folderRootHashEntry, session)

			expect(folderFromRoot).toBeInstanceOf(Sync.V3.Folder)
			expect(folderFromRoot.name).toBe('test-folder-move')
			expect(folderFromRoot.metadata.folderId).toBe('trash')
		}, 1000000000)
	})
})

