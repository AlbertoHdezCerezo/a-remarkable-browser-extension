import {Document} from '../../../../src/lib/remarkableApi/cache/document'
import * as Sync from '../../../../src/lib/remarkableApi/internal/sync'

describe('Document', () => {
	const root = global.root
	const pdfFile = global.pdfFile
	const ePubFile = global.ePubFile


	describe('.fromJson', () => {
		it('from a PDF document JSON, returns Document instance', () => {
			const pdfDocumentJson = JSON.stringify(
				{
					documentRootHashEntryPayload: pdfFile.rootHashEntry.payload,
					documentHashEntriesPayload: pdfFile.hashEntries.payload,
					documentMetadataPayload: JSON.stringify(pdfFile.metadata.payload)
				}
			)

			const pdfDocument = Document.fromJson(pdfDocumentJson, root)

			expect(pdfDocument).toBeInstanceOf(Document)
			expect(pdfDocument.apiDocument).toBeInstanceOf(Sync.V3.PdfFile)
			expect(pdfDocument.apiDocument.root.hashEntries.payload).toBe(root.hashEntries.payload)
			expect(pdfDocument.apiDocument.hashEntries.payload).toBe(pdfFile.hashEntries.payload)
			expect(pdfDocument.apiDocument.rootHashEntry.payload).toBe(pdfFile.rootHashEntry.payload)
		})

		it('from an ePub document JSON, returns Document instance', () => {
			const epubDocumentJson = JSON.stringify(
				{
					documentRootHashEntryPayload: ePubFile.rootHashEntry.payload,
					documentHashEntriesPayload: ePubFile.hashEntries.payload,
					documentMetadataPayload: JSON.stringify(ePubFile.metadata.payload)
				}
			)

			const epubDocument = Document.fromJson(epubDocumentJson, root)

			expect(epubDocument).toBeInstanceOf(Document)
			expect(epubDocument.apiDocument).toBeInstanceOf(Sync.V3.EpubFile)
			expect(epubDocument.apiDocument.root.hashEntries.payload).toBe(root.hashEntries.payload)
			expect(epubDocument.apiDocument.hashEntries.payload).toBe(ePubFile.hashEntries.payload)
			expect(epubDocument.apiDocument.rootHashEntry.payload).toBe(ePubFile.rootHashEntry.payload)
		})
	})

	describe('#toJson', () => {
		it('from a PDF document, dumps document to JSON string', () => {
			const document = new Document(pdfFile)

			expect(document.toJson).toEqual(
				JSON.stringify({
					documentRootHashEntryPayload: pdfFile.rootHashEntry.payload,
					documentHashEntriesPayload: pdfFile.hashEntries.payload,
					documentMetadataPayload: JSON.stringify(pdfFile.metadata.payload)
				})
			)
		})

		it('from an ePub document, dumps document to JSON string', () => {
			const document = new Document(ePubFile)

			expect(document.toJson).toEqual(
				JSON.stringify({
					documentRootHashEntryPayload: ePubFile.rootHashEntry.payload,
					documentHashEntriesPayload: ePubFile.hashEntries.payload,
					documentMetadataPayload: JSON.stringify(ePubFile.metadata.payload)
				})
			)
		})
	})
})
