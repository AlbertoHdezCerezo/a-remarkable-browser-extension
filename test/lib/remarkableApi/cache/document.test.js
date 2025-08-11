import Document from '../../../../src/lib/remarkableApi/cache/document'
import Root from '../../../../src/lib/remarkableApi/internal/sync/root'
import PdfFile from '../../../../src/lib/remarkableApi/internal/sync/v3/files/pdf/pdfFile'
import EpubFile from '../../../../src/lib/remarkableApi/internal/sync/v3/files/epub/epubFile'
import {HashEntriesFactory} from '../../../../src/lib/remarkableApi/internal/schemas/index'

describe('Document', () => {
	const root = new Root(
		'9d8a6b1057a54a0dc85eed97fdc9f2e6f3ea99d991209538b4555ffc482979c7',
		1754913481721295,
		HashEntriesFactory.fromPayload(`
					4
					0:.:429:17169122510
					2a8ade6addbc0e9bec3a5dd96ae61c5344b40c84914d3ceee02f5a0318d40a75:0:008302bc-c5ba-41be-925b-8567166246e4:5:5665650
					285f93a304f940f37432440974df5e633ee2d77dcd18437da4c2c78bb29becc9:0:00f9663d-3d4a-4640-a755-3a0e66b44f1d:4:3943269
					e6ac06a8696c36bb446962ec39df689dfa3765d81cd701f30e133df927df67d3:0:03d93d9b-b6f3-4503-9993-26faf23c22e1:1:161
					5ade6b3c89f1483a3e770d0392e86e3593307e6d53b1e1f48cb66f9a116bdad2:0:04374835-5769-40a9-897e-88050f8f3501:4:107426982
					2c9a9e10984e55e0ba7206a189dba6f007dcd46122b92720d916ca551ee96ca9:0:05ad2707-750f-4a8c-9513-66aa2917a906:4:3684358
					a9cae2ec2359d092036248084c400fe3fcf73b06ecd080739db2434fa79447af:0:05d8aaa7-641a-4bd4-a21e-c359d8129ab6:4:57221792
					7a6c64d0d2a619eaab290e1a0d179af6ba11e2b5b4ae64c24c834d4af6d1a930:0:0608d996-dd20-4d19-970d-bc803fd91b78:4:17780398
				`.trim().replace(/\t+/g, ''))
	)

	const pdfFile = new PdfFile(
		root,
		root.hashEntries.hashEntriesList[1],
		HashEntriesFactory.fromPayload(`
					4
					0:00f9663d-3d4a-4640-a755-3a0e66b44f1d:4:3943269
					780732e69c78b05b7f508316ca013c968f20b9bd0464a4f9339bdb768e4bb0f3:0:00f9663d-3d4a-4640-a755-3a0e66b44f1d.content:0:221415
					2185b615ab1e669ddbb9042c42a4c7556aa4300de5a77d240d750c1eb7bc8656:0:00f9663d-3d4a-4640-a755-3a0e66b44f1d.metadata:0:207
					a537198255252c5712d4d5f5c85f057ad7befe4928daf3251fa0e0bf79c04521:0:00f9663d-3d4a-4640-a755-3a0e66b44f1d.pagedata:0:481
					f64d12ede9875abddb4ed7195dac67dd1a65b36cbf854c049691e7f25ba2f3cc:0:00f9663d-3d4a-4640-a755-3a0e66b44f1d.pdf:0:3721166
				`.trim().replace(/\t+/g, '')),
		{
			createdTime: "0",
			lastModified: "1754729205389",
			lastOpened: "1702267131426",
			lastOpenedPage: 206,
			new: false,
			parent: "trash",
			pinned: false,
			source: "",
			type: "DocumentType",
			visibleName: "New PDF Name"
		}
	)

	const epubFile = new EpubFile(
		root,
		root.hashEntries.hashEntriesList[1],
		HashEntriesFactory.fromPayload(`
					4
					0:008302bc-c5ba-41be-925b-8567166246e4:5:5665650
					cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531
					cf0603f27e347959822926d78430c77e4264f014a9c816fe33029befb4a80f12:0:008302bc-c5ba-41be-925b-8567166246e4.epub:0:2583509
					c57551e934d2eb84a1d2f938115ed2f5c2f8f45c27a3e6a23e0a9f41158f98d0:0:008302bc-c5ba-41be-925b-8567166246e4.metadata:0:218
					63fdd266a9e733b0807f9e884e3d7c0e76cbe3100f72bef4f67865172cbbeccd:0:008302bc-c5ba-41be-925b-8567166246e4.pagedata:0:2346
					322e173fac914ce59df9db85a533b6eb65d9e0e8807d07ca57f9c6e18b76af29:0:008302bc-c5ba-41be-925b-8567166246e4.pdf:0:3053046
				`.trim().replace(/\t+/g, '')),
		{
			createdTime: "1738999062399",
			lastModified: "1754729236694",
			lastOpened: "1739390402818",
			lastOpenedPage: 5,
			new: false,
			parent: "trash",
			pinned: false,
			source: "",
			type: "DocumentType",
			visibleName: "New ePub Name"
		}
	)

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
			expect(pdfDocument.apiDocument).toBeInstanceOf(PdfFile)
			expect(pdfDocument.apiDocument.root.hashEntries.payload).toBe(root.hashEntries.payload)
			expect(pdfDocument.apiDocument.hashEntries.payload).toBe(pdfFile.hashEntries.payload)
			expect(pdfDocument.apiDocument.rootHashEntry.payload).toBe(pdfFile.rootHashEntry.payload)
		})

		it('from an ePub document JSON, returns Document instance', () => {
			const epubDocumentJson = JSON.stringify(
				{
					documentRootHashEntryPayload: epubFile.rootHashEntry.payload,
					documentHashEntriesPayload: epubFile.hashEntries.payload,
					documentMetadataPayload: JSON.stringify(epubFile.metadata.payload)
				}
			)

			const epubDocument = Document.fromJson(epubDocumentJson, root)

			expect(epubDocument).toBeInstanceOf(Document)
			expect(epubDocument.apiDocument).toBeInstanceOf(EpubFile)
			expect(epubDocument.apiDocument.root.hashEntries.payload).toBe(root.hashEntries.payload)
			expect(epubDocument.apiDocument.hashEntries.payload).toBe(epubFile.hashEntries.payload)
			expect(epubDocument.apiDocument.rootHashEntry.payload).toBe(epubFile.rootHashEntry.payload)
		})
	})

	describe('#toJson', () => {
		it('from a PDF document, dumps document to JSON string', () => {
			const document = new Document(pdfFile)

			expect(document.toJson).toEqual({
				documentRootHashEntryPayload: pdfFile.rootHashEntry.payload,
				documentHashEntriesPayload: pdfFile.hashEntries.payload,
				documentMetadataPayload: JSON.stringify(pdfFile.metadata.payload)
			})
		})

		it('from an ePub document, dumps document to JSON string', () => {
			const document = new Document(epubFile)

			expect(document.toJson).toEqual({
				documentRootHashEntryPayload: epubFile.rootHashEntry.payload,
				documentHashEntriesPayload: epubFile.hashEntries.payload,
				documentMetadataPayload: JSON.stringify(epubFile.metadata.payload)
			})
		})
	})
})
