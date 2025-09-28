import {setupHttpRecording} from '../../helpers/pollyHelper.js'
import {Download} from '../../../src/lib/downloadsApi/Download.js'

describe('Download', () => {
	describe('#serialize', () => {
		it('serializes Download to JSON', () => {
			const download = new Download(
				'https://example.com/download/file.pdf',
				'file.pdf',
				'123e4567-e89b-12d3-a456-426614174000',
				new Date('2024-01-01T12:00:00Z')
			)

			const serialized = download.serialize()

			expect(serialized).toBe(JSON.stringify({
				url: 'https://example.com/download/file.pdf',
				name: 'file.pdf',
				fileId: '123e4567-e89b-12d3-a456-426614174000',
				downloadedAt: '2024-01-01T12:00:00.000Z'
			}))
		})
	})

	describe('#deserialize', () => {
		it('deserializes JSON to Download instance', () => {
			const stringifiedDownload = JSON.stringify({
				url: 'https://example.com/download/file.pdf',
				name: 'file.pdf',
				fileId: '123e4567-e89b-12d3-a456-426614174000',
				downloadedAt: '2024-01-01T12:00:00.000Z'
			})

			const download = Download.deserialize(stringifiedDownload)

			expect(download).toBeInstanceOf(Download)
			expect(download.url).toBe('https://example.com/download/file.pdf')
			expect(download.name).toBe('file.pdf')
			expect(download.fileId).toBe('123e4567-e89b-12d3-a456-426614174000')
			expect(download.downloadedAt.toISOString()).toBe('2024-01-01T12:00:00.000Z')
		})
	})

	describe('#sizeInBytes', () => {
		setupHttpRecording()

		it('fetches the size of the file to be downloaded', async () => {
			const download = new Download(
				'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
				'dummy.pdf',
				'123e4567-e89b-12d3-a456-426614174000',
				new Date()
			)

			const size = await download.sizeInBytes()

			expect(size).toBe(13264)
		})
	})

	describe('#buffer', () => {
		it('fetches the download URL content, returning it as a Buffer', async () => {
			const download = new Download(
				'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
				'dummy.pdf',
				'123e4567-e89b-12d3-a456-426614174000',
				new Date()
			)

			const buffer = await download.buffer()

			expect(buffer).toBeInstanceOf(Buffer)
			expect(buffer.length).toBe(22503)
		})
	})
})
