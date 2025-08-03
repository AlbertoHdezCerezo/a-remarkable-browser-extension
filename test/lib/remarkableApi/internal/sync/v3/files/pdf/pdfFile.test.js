import {setupHttpRecording} from '../../../../../../../helpers/pollyHelper'
import DeviceConnection from '../../../../../../../../src/lib/remarkableApi/deviceConnection'
import Session from '../../../../../../../../src/lib/remarkableApi/session'
import Root from '../../../../../../../../src/lib/remarkableApi/internal/sync/root'
import PdfFile from '../../../../../../../../src/lib/remarkableApi/internal/sync/v3/files/pdf/pdfFile'

describe('PdfFile', () => {
	setupHttpRecording()

	describe('#rename', () => {
		it('given a PDF file, renames it in the reMarkable Cloud', async () => {
			const deviceConnection = new DeviceConnection(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			const root = await Root.fromSession(session)
			const pdfHashEntry = root.hashEntries.hashEntriesList.find(entry => entry.fileId === '4f1709e6-e7ab-4fc4-b619-11e30b5120f5')

			const pdfFile = await PdfFile.fromHashEntry(root, pdfHashEntry, session)

			const result = await pdfFile.rename('renamed.pdf', session)
		})
	})
})