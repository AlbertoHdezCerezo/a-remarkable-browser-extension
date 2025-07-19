import fs from 'fs'
import FileBuffer, {UnsupportedFileExtensionError} from '../../../../src/lib/remarkableApi/utils/fileBuffer'

describe('fileBuffer', () => {
	describe('.extension', () => {
		it('given a PDF file buffer, returns pdf', () => {
			const pdfBuffer = fs.readFileSync('./test/fixtures/documents/sample.pdf')
			const fileBuffer = new FileBuffer(pdfBuffer)
			expect(fileBuffer.extension).toBe('pdf')
		})

		it('given an EPUB file buffer, returns epub', () => {
			const epubBuffer = fs.readFileSync('./test/fixtures/documents/sample.epub')
			const fileBuffer = new FileBuffer(epubBuffer)
			expect(fileBuffer.extension).toBe('epub')
		})

		it('given an unknown file buffer, throws unsupported file extension error', () => {
			const unknownBuffer = fs.readFileSync('./test/fixtures/documents/sample.txt')
			expect(() => new FileBuffer(unknownBuffer)).toThrow(UnsupportedFileExtensionError)
		})
	})

	describe('.mimeType', () => {
		it('given a PDF file buffer, returns application/pdf', () => {
			const pdfBuffer = fs.readFileSync('./test/fixtures/documents/sample.pdf')
			const fileBuffer = new FileBuffer(pdfBuffer)
			expect(fileBuffer.mimeType).toBe('application/pdf')
		})

		it('given an EPUB file buffer, returns application/epub+zip', () => {
			const epubBuffer = fs.readFileSync('./test/fixtures/documents/sample.epub')
			const fileBuffer = new FileBuffer(epubBuffer)
			expect(fileBuffer.mimeType).toBe('application/epub+zip')
		})

		it('given an unknown file buffer, throws unsupported file extension error', () => {
			const unknownBuffer = fs.readFileSync('./test/fixtures/documents/sample.txt')
			expect(() => new FileBuffer(unknownBuffer)).toThrow(UnsupportedFileExtensionError)
		})
	})
})
