import {setupHttpRecording} from '../../../helpers/pollyHelper'
import Device from '../../../../src/lib/remarkableApi/internal/token/device.js'
import Session from '../../../../src/lib/remarkableApi/internal/token/session.js'
import Snapshot from '../../../../src/lib/remarkableApi/cache/snapshot'
import Document from '../../../../src/lib/remarkableApi/cache/document'
import Folder from '../../../../src/lib/remarkableApi/cache/folder'

describe('Snapshot', () => {
	setupHttpRecording()

	describe('.fromSession', () => {
		it('returns a snapshot of reMarkable cloud account attached to session', async () => {
			const deviceConnection = new Device(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			const snapshot = await Snapshot.fromSession(session)

			expect(snapshot).toBeInstanceOf(Snapshot)
			expect(snapshot.root).toBeDefined()
			expect(snapshot.documents).toBeInstanceOf(Array)
			expect(snapshot.folders).toBeInstanceOf(Array)
			expect(snapshot.documents.length).toBeGreaterThan(0)
			expect(snapshot.documents[0]).toBeInstanceOf(Document)
			expect(snapshot.folders[0]).toBeInstanceOf(Folder)
		}, 100000000)
	})
})
