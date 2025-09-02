import fs from 'fs'
import {setupHttpRecording} from '../helpers/pollyHelper.js'
import * as Doc from '../../src/lib/remarkableApi/internal/doc'
import * as Sync from '../../src/lib/remarkableApi/internal/sync'
import {FileBuffer} from '../../src/lib/remarkableApi'

describe('reMarkable API integration specs', () => {
	setupHttpRecording()

	let pdfFile = null
	let epubFile = null
	let session = global.remarkableApiSession

	it('manages a reMarkable files', async () => {
		// - Upload a PDF file
		const pdfBuffer = fs.readFileSync('./test/fixtures/documents/sample.pdf')
		const pdfFileBuffer = new FileBuffer(pdfBuffer)

		pdfFile = await Doc.V2Upload.upload("a-remarkable-web-browser-sample.pdf", pdfFileBuffer, session)

		expect(pdfFile).toBeInstanceOf(Sync.V3.PdfFile)

		// - Upload an e-Pub file
		const epubBuffer = fs.readFileSync('./test/fixtures/documents/sample.epub')
		const epubFileBuffer = new FileBuffer(epubBuffer)

		epubFile = await Doc.V2Upload.upload("a-remarkable-web-browser-sample.epub", epubFileBuffer, session)

		expect(epubFile).toBeInstanceOf(Sync.V3.EpubFile)

		// - Load a Snapshot
		const pdfSnapshot = await

		// - Remove PDF & ePub files
		await pdfFile.moveToTrash(session)
		await epubFile.moveToTrash(session)
	})
})