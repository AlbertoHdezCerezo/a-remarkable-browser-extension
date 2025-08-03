import {setupHttpRecording} from '../../../../../../../helpers/pollyHelper'
import {HashEntry} from '../../../../../../../../src/lib/remarkableApi/internal/schemas/v4/hashEntry'
import RequestBuffer from '../../../../../../../../src/lib/remarkableApi/internal/sync/v3/utils/requestBuffer'
import PdfMetadata from '../../../../../../../../src/lib/remarkableApi/internal/sync/v3/files/pdf/pdfMetadata'
import DeviceConnection from '../../../../../../../../src/lib/remarkableApi/deviceConnection'
import Session from '../../../../../../../../src/lib/remarkableApi/session'

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

	describe('#update', () => {
		setupHttpRecording()

		it('updates PDF file metadata against the reMarkable API', async () => {
			const deviceConnection = new DeviceConnection(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)
			const pdfFileRootHashEntry = new HashEntry('3ca0a5c6320ea93d185aa04e5ed1bae1469bdb06b6eb97adb59ee7ab8c86fb58:0:d4da3a60-8afb-4db6-82b4-de9154c26355.metadata:0:300')
			const pdfMetadataPayload = {
				"createdTime": "1732308492654",
				"lastModified": "1740911801443",
				"lastOpened": "1732369981529",
				"lastOpenedPage": 55,
				"parent": "trash",
				"pinned": false,
				"type": "DocumentType",
				"visibleName": "Test-File.pdf"
			}

			const pdfMetadata = new PdfMetadata(pdfFileRootHashEntry, pdfMetadataPayload)

			const newPdfMetadataHasEntry = await pdfMetadata.update({ visibleName: 'Updated-File.pdf' }, session)

			const expectedPdfMetadataPayload = JSON.stringify({ ...pdfMetadataPayload, "visibleName": "Updated-File.pdf" })
			const expectedRequestBuffer = new RequestBuffer(expectedPdfMetadataPayload)
			const expectedPdfMetadataHash = await expectedRequestBuffer.checksum()

			expect(newPdfMetadataHasEntry.fileId).toBe('d4da3a60-8afb-4db6-82b4-de9154c26355')
			expect(newPdfMetadataHasEntry.sizeInBytes).toBe(expectedRequestBuffer.sizeInBytes)
			expect(newPdfMetadataHasEntry.fileExtension).toBe('metadata')
			expect(newPdfMetadataHasEntry.checksum).toBe(expectedPdfMetadataHash)

			const resultingPdfMetadata = await newPdfMetadataHasEntry.content(session)

			expect(resultingPdfMetadata.visibleName).toBe('Updated-File.pdf')
		})
	})
})