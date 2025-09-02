import fs from 'fs'
import {expect, jest} from '@jest/globals'
import {CONFIGURATION} from '../../../../../../src/lib/remarkableApi'
import {FileBuffer} from '../../../../../../src/lib/remarkableApi/utils'
import {FetchBasedHttpClient} from '../../../../../../src/lib/utils/httpClient'
import {Upload} from '../../../../../../src/lib/remarkableApi/internal/doc/v2'
import * as V3 from '../../../../../../src/lib/remarkableApi/internal/sync/v3'

describe('Upload', () => {
	describe('.upload', () => {
		let session = global.remarkableApiSession
		let pdfFileBuffer = new FileBuffer(fs.readFileSync('./test/fixtures/documents/sample.pdf'))
		let ePubFileBuffer = new FileBuffer(fs.readFileSync('./test/fixtures/documents/sample.epub'))

		it('given a PDF file buffer with a compatible extension, uploads it to the device', async () => {
			FetchBasedHttpClient.post = jest.fn()
			FetchBasedHttpClient
				.post
				.mockImplementationOnce((...args) => {
					expect(args[0]).toEqual(CONFIGURATION.endpoints.doc.v2.endpoints.files)
					expect(args[1]).toEqual(pdfFileBuffer.buffer)
					expect(args[2]).toEqual({
						'Authorization': `Bearer ${session.token}`,
						'content-type': 'application/pdf',
						'rm-meta': 'eyJmaWxlX25hbWUiOiJhLXJlbWFya2FibGUtd2ViLWJyb3dzZXItc2FtcGxlLnBkZiJ9',
						'rm-source': 'RoR-Browser'
					})

					return Promise.resolve({ok: true, status: 200, json: () => Promise.resolve({ hash: global.pdfFileChecksum })})
				})
			FetchBasedHttpClient.get = jest.fn()
			FetchBasedHttpClient
				.get
				.mockImplementationOnce((...args) => {
					expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.root)
					expect(args[1]).toEqual({'Authorization': `Bearer ${session.token}`})

					return Promise.resolve({ok: true, status: 200, json: () => Promise.resolve(global.rootMetadata)})
				})
				.mockImplementationOnce((...args) => {
					expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.files + global.rootHashChecksum)
					expect(args[1]).toEqual({'Authorization': `Bearer ${session.token}`})

					return Promise.resolve({ok: true, status: 200, text: () => Promise.resolve(global.rootHashEntriesPayload)})
				})
				.mockImplementationOnce((...args) => {
					expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.files + global.pdfFileChecksum)
					expect(args[1]).toEqual({'Authorization': `Bearer ${session.token}`})

					return Promise.resolve({ok: true, status: 200, text: () => Promise.resolve(global.pdfHashEntriesPayload)})
				})
				.mockImplementationOnce((...args) => {
					expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.files + global.pdfMetadataChecksum)
					expect(args[1]).toEqual({'Authorization': `Bearer ${session.token}`})

					return Promise.resolve({ok: true, status: 200, text: () => Promise.resolve(JSON.stringify(global.pdfMetadata))})
				})

			const pdfFile = await Upload.upload("a-remarkable-web-browser-sample.pdf", pdfFileBuffer, session)

			expect(pdfFile).toBeInstanceOf(V3.PdfFile)
		})

		it('given an ePub file buffer with a compatible extension, uploads it to the device', async () => {
			FetchBasedHttpClient.post = jest.fn()
			FetchBasedHttpClient
				.post
				.mockImplementationOnce((...args) => {
					expect(args[0]).toEqual(CONFIGURATION.endpoints.doc.v2.endpoints.files)
					expect(args[1]).toEqual(ePubFileBuffer.buffer)
					expect(args[2]).toEqual({
						'Authorization': `Bearer ${session.token}`,
						'content-type': 'application/epub+zip',
						'rm-meta': 'eyJmaWxlX25hbWUiOiJhLXJlbWFya2FibGUtd2ViLWJyb3dzZXItc2FtcGxlLmVwdWIifQ==',
						'rm-source': 'RoR-Browser'
					})

					return Promise.resolve({ok: true, status: 200, json: () => Promise.resolve({ hash: global.ePubFileChecksum })})
				})
			FetchBasedHttpClient.get = jest.fn()
			FetchBasedHttpClient
				.get
				.mockImplementationOnce((...args) => {
					expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.root)
					expect(args[1]).toEqual({'Authorization': `Bearer ${session.token}`})

					return Promise.resolve({ok: true, status: 200, json: () => Promise.resolve(global.rootMetadata)})
				})
				.mockImplementationOnce((...args) => {
					expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.files + global.rootHashChecksum)
					expect(args[1]).toEqual({'Authorization': `Bearer ${session.token}`})

					return Promise.resolve({ok: true, status: 200, text: () => Promise.resolve(global.rootHashEntriesPayload)})
				})
				.mockImplementationOnce((...args) => {
					expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.files + global.ePubFileChecksum)
					expect(args[1]).toEqual({'Authorization': `Bearer ${session.token}`})

					return Promise.resolve({ok: true, status: 200, text: () => Promise.resolve(global.ePubHashEntriesPayload)})
				})
				.mockImplementationOnce((...args) => {
					expect(args[0]).toEqual(CONFIGURATION.endpoints.sync.v3.endpoints.files + global.ePubMetadataChecksum)
					expect(args[1]).toEqual({'Authorization': `Bearer ${session.token}`})

					return Promise.resolve({ok: true, status: 200, text: () => Promise.resolve(JSON.stringify(global.ePubMetadata))})
				})

			const epubFile = await Upload.upload("a-remarkable-web-browser-sample.epub", ePubFileBuffer, session)

			expect(epubFile).toBeInstanceOf(V3.EpubFile)
		})
	})
})

