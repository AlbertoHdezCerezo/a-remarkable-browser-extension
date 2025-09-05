import fs from 'fs'
import {afterAll, expect} from '@jest/globals'
import {setupHttpRecording} from '../helpers/pollyHelper.js'
import {FileBuffer} from '../../src/lib/remarkableApi'
import * as RemarkableApi from '../../src/lib/remarkableApi'

describe('reMarkable API integration specs', () => {
	setupHttpRecording()

	let root = null
	let folder = null
	let pdfFile = null
	let epubFile = null
	let session = global.remarkableApiSession

	afterAll(() => {
	})

	it('creates a PDF file', async () => {
		const pdfBuffer = fs.readFileSync('./test/fixtures/documents/sample.pdf')
		const pdfFileBuffer = new FileBuffer(pdfBuffer)

		pdfFile = await RemarkableApi.Internal.Doc.V2.Upload.upload("a-remarkable-web-browser-sample.pdf", pdfFileBuffer, session)

		expect(pdfFile).toBeInstanceOf(RemarkableApi.Internal.Sync.V3.PdfFile)
		expect(pdfFile.metadata.fileName).toBe("a-remarkable-web-browser-sample.pdf")
	}, 100000000)

	it('creates an ePub file', async () => {
		// - Upload an e-Pub file
		const epubBuffer = fs.readFileSync('./test/fixtures/documents/sample.epub')
		const epubFileBuffer = new FileBuffer(epubBuffer)

		epubFile = await RemarkableApi.Internal.Doc.V2.Upload.upload("a-remarkable-web-browser-sample.epub", epubFileBuffer, session)

		expect(epubFile).toBeInstanceOf(RemarkableApi.Internal.Sync.V3.EpubFile)
		expect(epubFile.metadata.fileName).toBe("a-remarkable-web-browser-sample.epub")
	}, 100000000)

	it('creates a folder', async () => {
		// Load Root instance
		root = await RemarkableApi.Internal.Sync.Root.fromSession(session)
		expect(root).toBeInstanceOf(RemarkableApi.Internal.Sync.Root)

		// Create a folder
		folder = await RemarkableApi.Internal.Sync.V3.Folder.create(root, "A sample folder", session)
		expect(folder).toBeInstanceOf(RemarkableApi.Internal.Sync.V3.Folder)
		expect(folder.metadata.folderName).toBe("A sample folder")
	}, 100000000)
})
