import fs from 'fs'
import {FileBuffer} from '../../../src/lib/remarkableApi/utils'
import {setupHttpRecording} from '../../helpers/pollyHelper.js'
import {Upload} from '../../../src/lib/remarkableApi/internal/doc/v2'
import * as Sync from '../../../src/lib/remarkableApi/internal/sync'

describe('Upload', () => {
	setupHttpRecording()

	describe('.upload', () => {
		let session = global.remarkableApiSession
		let pdfFileBuffer = new FileBuffer(fs.readFileSync('./test/fixtures/documents/sample.pdf'))
		let ePubFileBuffer = new FileBuffer(fs.readFileSync('./test/fixtures/documents/sample.epub'))

		it('given a PDF file buffer with a compatible extension, uploads it to the device', async () => {
			const pdfFile = await Upload.upload("a-remarkable-web-browser-sample.pdf", pdfFileBuffer, session)

			expect(pdfFile).toBeInstanceOf(Sync.V3.PdfFile)

			const root = await Sync.Root.fromSession(session)
			const pdfFileRootHashEntry = root.hashEntries.hashEntriesList.find(entry => entry.checksum === pdfFile.rootHashEntry.checksum)

			expect(pdfFileRootHashEntry).toBeDefined()
		}, 1000000000)

		it('given an ePub file buffer with a compatible extension, uploads it to the device', async () => {
			const ePubFile = await Upload.upload("a-remarkable-web-browser-sample.epub", ePubFileBuffer, session)

			expect(ePubFile).toBeInstanceOf(Sync.V3.EpubFile)

			const root = await Sync.Root.fromSession(session)
			const ePubFileRootHashEntry = root.hashEntries.hashEntriesList.find(entry => entry.checksum === ePubFile.rootHashEntry.checksum)

			expect(ePubFileRootHashEntry).toBeDefined()
		}, 1000000000)
	})
})

