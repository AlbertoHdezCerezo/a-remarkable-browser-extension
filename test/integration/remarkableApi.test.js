import fs from 'fs'
import {setupHttpRecording} from '../helpers/pollyHelper.js'
import {FileBuffer} from '../../src/lib/remarkableApi/index.js'
import {V2Upload} from '../../src/lib/remarkableApi/internal/doc'

describe('reMarkable API integration specs', () => {
	setupHttpRecording()

	let pdfFile = null
	let epubFile = null
	let session = global.remarkableApiSession

	it('manages a reMarkable files', async () => {
		// - Upload a PDF file
		const pdfBuffer = fs.readFileSync('./test/fixtures/documents/sample.pdf')
		const pdfFileBuffer = new FileBuffer(pdfBuffer)

		pdfFile = await Upload.upload("a-remarkable-web-browser-sample.pdf", pdfFileBuffer, session)

		expect(pdfFile).toBeInstanceOf(File)

		// - Upload an e-Pub file
		const epubBuffer = fs.readFileSync('./test/fixtures/documents/sample.epub')
		const epubFileBuffer = new FileBuffer(epubBuffer)

		epubFile = await V2Upload.upload("a-remarkable-web-browser-sample.epub", epubFileBuffer, session)

		expect(epubFile).toBeInstanceOf(File)

		// - Remove PDF & ePub files
		await pdfFile.moveToTrash(session)
		await epubFile.moveToTrash(session)
	})
})