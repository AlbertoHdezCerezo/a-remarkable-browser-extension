import HashEntry from '../../../../../../../../src/lib/remarkableApi/internal/sync/hashEntry'
import PdfMetadata from '../../../../../../../../src/lib/remarkableApi/internal/sync/v3/files/pdf/pdfMetadata'

describe('PdfMetadata', () => {
	const pdfFileRootHashEntry = new HashEntry('e8e5d89278eebfded00982a272393d62fbd7fab1d9b4fc99b001f6ba342260c2:0:00f9663d-3d4a-4640-a755-3a0e66b44f1d:4:3943357')

	const pdfMetadataPayload = {
		"createdTime": "0",
		"lastModified": "1702268352386",
		"lastOpened": "1702267131426",
		"lastOpenedPage": 206,
		"parent": "81213c35-e5a9-4b39-9813-452ccb394dcd",
		"pinned": false,
		"type": "DocumentType",
		"visibleName": "File-Name.pdf"
	}

	const pdfMetadata = new PdfMetadata(pdfFileRootHashEntry, pdfMetadataPayload)

	describe('#pdfFileHashEntry', () => {
		it('returns the PDF file root hash entry', () => {
			expect(pdfMetadata.pdfFileHashEntry).toBe(pdfFileRootHashEntry)
		})
	})

	describe('#payload', () => {
		it('returns the metadata payload of the PDF file', () => {
			expect(pdfMetadata.payload).toEqual(pdfMetadataPayload)
		})
	})

	describe('#fileName', () => {
		it('returns PDF file name', () => {
			expect(pdfMetadata.fileName).toBe('File-Name.pdf')
		})
	})

	describe('#folderId', () => {
		it('returns unique UUID of the folder containing the PDF file', () => {
			expect(pdfMetadata.folderId).toBe('81213c35-e5a9-4b39-9813-452ccb394dcd')
		})
	})
})