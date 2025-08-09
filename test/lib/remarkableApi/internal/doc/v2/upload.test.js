import fs from 'fs'
import {setupHttpRecording} from '../../../../../helpers/pollyHelper.js'
import FileBuffer from '../../../../../../src/lib/remarkableApi/utils/fileBuffer.js'
import DeviceConnection from '../../../../../../src/lib/remarkableApi/deviceConnection.js'
import Session from '../../../../../../src/lib/remarkableApi/session.js'
import Upload from '../../../../../../src/lib/remarkableApi/internal/doc/v2/upload.js'
import File from '../../../../../../src/lib/remarkableApi/internal/sync/v3/files/abstracts/file'

describe('Upload', () => {
	setupHttpRecording()

	describe('.upload', () => {
		it('given a file buffer with a compatible extension, uploads it to the device', async () => {
			const pdfBuffer = fs.readFileSync('./test/fixtures/documents/sample.pdf')
			const fileBuffer = new FileBuffer(pdfBuffer)

			const deviceConnection = new DeviceConnection(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			const uploadDocumentHashEntry = await Upload.upload("sample.pdf", fileBuffer, session)

			expect(uploadDocumentHashEntry).toBeInstanceOf(File)
		})
	})
})