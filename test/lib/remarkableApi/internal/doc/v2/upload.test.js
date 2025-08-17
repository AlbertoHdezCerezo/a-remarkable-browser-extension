import fs from 'fs'
import {setupHttpRecording} from '../../../../../helpers/pollyHelper.js'
import FileBuffer from '../../../../../../src/lib/remarkableApi/utils/fileBuffer'
import Upload from '../../../../../../src/lib/remarkableApi/internal/doc/v2/upload'
import File from '../../../../../../src/lib/remarkableApi/internal/sync/v3/files/abstracts/file'

describe('Upload', () => {
	setupHttpRecording()

	describe('.upload', () => {
		it('given a PDF file buffer with a compatible extension, uploads it to the device', async () => {
			const pdfBuffer = fs.readFileSync('./test/fixtures/documents/sample.pdf')
			const fileBuffer = new FileBuffer(pdfBuffer)

			const session = global.remarkableApiSession

			const uploadDocumentHashEntry = await Upload.upload("sample.pdf", fileBuffer, session)

			expect(uploadDocumentHashEntry).toBeInstanceOf(File)
		})

		it('given an ePub file buffer with a compatible extension, uploads it to the device', async () => {
			const epubBuffer = fs.readFileSync('./test/fixtures/documents/sample.epub')
			const fileBuffer = new FileBuffer(epubBuffer)

			const session = global.remarkableApiSession

			const uploadDocumentHashEntry = await Upload.upload("sample.epub", fileBuffer, session)

			expect(uploadDocumentHashEntry).toBeInstanceOf(File)
		})
	})
})