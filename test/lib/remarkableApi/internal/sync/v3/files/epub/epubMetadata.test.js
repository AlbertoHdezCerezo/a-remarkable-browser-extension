import {setupHttpRecording} from '../../../../../../../helpers/pollyHelper'
import {HashEntry} from '../../../../../../../../src/lib/remarkableApi/internal/schemas/v4/hashEntry'
import RequestBuffer from '../../../../../../../../src/lib/remarkableApi/internal/sync/v3/utils/requestBuffer'
import EpubMetadata from '../../../../../../../../src/lib/remarkableApi/internal/sync/v3/files/epub/epubMetadata'

describe('EpubMetadata', () => {
	const epubFileRootHashEntry = new HashEntry('e8e5d89278eebfded00982a272393d62fbd7fab1d9b4fc99b001f6ba342260c2:0:00f9663d-3d4a-4640-a755-3a0e66b44f1d:4:3943357')

	const epubMetadataPayload = {
		"createdTime": "1738999062399",
		"lastModified": "1739390477710",
		"lastOpened": "1739390402818",
		"lastOpenedPage": 5,
		"new": false,
		"parent": "4c6b5473-f424-4f18-88b3-e94051b7457b",
		"pinned": false,
		"source": "",
		"type": "DocumentType",
		"visibleName": "Epub Document.epub"
	}

	const epubMetadata = new EpubMetadata(epubFileRootHashEntry, epubMetadataPayload)

	describe('#pdfFileHashEntry', () => {
		it('returns the PDF file root hash entry', () => {
			expect(epubMetadata.epubFileRootHashEntry).toBe(epubFileRootHashEntry)
		})
	})

	describe('#payload', () => {
		it('returns the metadata payload of the PDF file', () => {
			expect(epubMetadata.payload).toEqual(epubMetadataPayload)
		})
	})

	describe('#fileName', () => {
		it('returns PDF file name', () => {
			expect(epubMetadata.fileName).toBe('Epub Document.epub')
		})
	})

	describe('#folderId', () => {
		it('returns unique UUID of the folder containing the PDF file', () => {
			expect(epubMetadata.folderId).toBe('4c6b5473-f424-4f18-88b3-e94051b7457b')
		})
	})

	describe('#update', () => {
		setupHttpRecording()

		it('updates ePub file metadata against the reMarkable API', async () => {
			const session = global.remarkableApiSession
			const epubFileRootHashEntry = new HashEntry('883411c7fa93637f63ada401b9fbe06eda8d16363f946dc7f296a05c3b3ba91d:0:008302bc-c5ba-41be-925b-8567166246e4:5:5665759')
			const epubMetadataPayload = {
				"createdTime": "1732308492654",
				"lastModified": "1740911801443",
				"lastOpened": "1732369981529",
				"lastOpenedPage": 55,
				"parent": "trash",
				"pinned": false,
				"type": "DocumentType",
				"visibleName": "Test-File.pdf"
			}

			const epubMetadata = new EpubMetadata(epubFileRootHashEntry, epubMetadataPayload)

			const newEpubMetadataHasEntry = await epubMetadata.update({ visibleName: 'Updated-File.pdf' }, session)

			const expectedEpubMetadataPayload = JSON.stringify({ ...epubMetadataPayload, "visibleName": "Updated-File.pdf" })
			const expectedRequestBuffer = new RequestBuffer(expectedEpubMetadataPayload)
			const expectedEpubMetadataHash = await expectedRequestBuffer.checksum()

			expect(newEpubMetadataHasEntry.fileId).toBe('008302bc-c5ba-41be-925b-8567166246e4')
			expect(newEpubMetadataHasEntry.sizeInBytes).toBe(expectedRequestBuffer.sizeInBytes)
			expect(newEpubMetadataHasEntry.fileExtension).toBe('metadata')
			expect(newEpubMetadataHasEntry.checksum).toBe(expectedEpubMetadataHash)

			const resultingEpubMetadata = await newEpubMetadataHasEntry.content(session)

			expect(resultingEpubMetadata.visibleName).toBe('Updated-File.pdf')
		})
	})
})