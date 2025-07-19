import fs from 'fs'
import {setupHttpRecording} from '../../../helpers/pollyHelper'
import Session from '../../../../src/lib/remarkableApi/session'
import Uploader from '../../../../src/lib/remarkableApi/internal/uploader'
import FileBuffer from '../../../../src/lib/remarkableApi/utils/fileBuffer'
import DeviceConnection from '../../../../src/lib/remarkableApi/deviceConnection'

describe('Session', () => {
	setupHttpRecording()

	describe('.upload', () => {
		it('given a file buffer with a compatible extension, uploads it to the device', async () => {
			const pdfBuffer = fs.readFileSync('./test/fixtures/documents/sample.pdf')
			const fileBuffer = new FileBuffer(pdfBuffer)

			const deviceConnection = new DeviceConnection(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			expect(session.expired).toBe(false)

			const uploadDocumentReference = await Uploader.upload("sample.pdf", fileBuffer, session)

			expect(uploadDocumentReference).toBeDefined()
			expect(uploadDocumentReference).toHaveProperty('id')
			expect(uploadDocumentReference).toHaveProperty('hash')
		})
	})
})