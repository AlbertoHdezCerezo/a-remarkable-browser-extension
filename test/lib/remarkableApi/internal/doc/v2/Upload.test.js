import fs from 'fs'
import {expect, jest} from '@jest/globals'
import {mockDocumentRequest, mockUploadRequest} from '../../../../../helpers/remarkableApiHelper.js'
import {FileBuffer} from '../../../../../../src/lib/remarkableApi/utils'
import {FetchBasedHttpClient} from '../../../../../../src/lib/utils/httpClient'
import {Upload} from '../../../../../../src/lib/remarkableApi/internal/doc/v2'
import * as Sync from '../../../../../../src/lib/remarkableApi/internal/sync'

describe('Upload', () => {
	let session = global.remarkableApiSession
	let pdfFileBuffer = new FileBuffer(fs.readFileSync('./test/fixtures/documents/sample.pdf'))
	let ePubFileBuffer = new FileBuffer(fs.readFileSync('./test/fixtures/documents/sample.epub'))

	describe('.folder', () => {
		it(`
			given a folder name,
				requests upload endpoint to create a new folder on the device
				and returns the newly created folder
		`.trim(), async () => {
			const fetchBasedHttpClientPostMock = jest.fn()
			mockUploadRequest(
				undefined,
				'folder',
				'eyJmaWxlX25hbWUiOiJhLXJlbWFya2FibGUtd2ViLWJyb3dzZXItc2FtcGxlLWZvbGRlciJ9',
				global.folderFileChecksum,
				fetchBasedHttpClientPostMock,
				session
			)
			FetchBasedHttpClient.post = fetchBasedHttpClientPostMock

			const fetchBasedHttpClientGetMock = jest.fn()
			mockDocumentRequest(
				global.folderFileChecksum,
				global.folderHashEntriesPayload,
				global.folderMetadataChecksum,
				global.folderMetadata,
				fetchBasedHttpClientGetMock,
				session
			)
			FetchBasedHttpClient.get = fetchBasedHttpClientGetMock

			const folder = await Upload.folder("a-remarkable-web-browser-sample-folder", session)

			expect(folder).toBeInstanceOf(Sync.V3.Folder)
		})
	})

	describe('.document', () => {
		it(`
			given a PDF file buffer,
				requests upload endpoint to upload the file to the device
				and returns the newly uploaded PDF file
		`.trim(), async () => {
			const fetchBasedHttpClientPostMock = jest.fn()
			mockUploadRequest(
				pdfFileBuffer.buffer,
				'application/pdf',
				'eyJmaWxlX25hbWUiOiJhLXJlbWFya2FibGUtd2ViLWJyb3dzZXItc2FtcGxlLnBkZiJ9',
				global.pdfFileChecksum,
				fetchBasedHttpClientPostMock,
				session
			)
			FetchBasedHttpClient.post = fetchBasedHttpClientPostMock

			const fetchBasedHttpClientGetMock = jest.fn()
			mockDocumentRequest(
				global.pdfFileChecksum,
				global.pdfHashEntriesPayload,
				global.pdfMetadataChecksum,
				global.pdfMetadata,
				fetchBasedHttpClientGetMock,
				session
			)
			FetchBasedHttpClient.get = fetchBasedHttpClientGetMock

			const pdfFile = await Upload.document("a-remarkable-web-browser-sample.pdf", pdfFileBuffer, session)

			expect(pdfFile).toBeInstanceOf(Sync.V3.PdfFile)
		})

		it(`
			given an ePub file buffer,
				requests upload endpoint to upload the file to the device
				and returns the newly uploaded ePub file
		`.trim(), async () => {
			const fetchBasedHttpClientPostMock = jest.fn()
			mockUploadRequest(
				ePubFileBuffer.buffer,
				'application/epub+zip',
				'eyJmaWxlX25hbWUiOiJhLXJlbWFya2FibGUtd2ViLWJyb3dzZXItc2FtcGxlLmVwdWIifQ==',
				global.ePubFileChecksum,
				fetchBasedHttpClientPostMock,
				session
			)
			FetchBasedHttpClient.post = fetchBasedHttpClientPostMock

			const fetchBasedHttpClientGetMock = jest.fn()
			mockDocumentRequest(
				global.ePubFileChecksum,
				global.ePubHashEntriesPayload,
				global.ePubMetadataChecksum,
				global.ePubMetadata,
				fetchBasedHttpClientGetMock,
				session
			)
			FetchBasedHttpClient.get = fetchBasedHttpClientGetMock

			const ePubFile = await Upload.document("a-remarkable-web-browser-sample.epub", ePubFileBuffer, session)

			expect(ePubFile).toBeInstanceOf(Sync.V3.EpubFile)
		})
	})
})
