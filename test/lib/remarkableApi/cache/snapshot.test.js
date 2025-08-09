import {setupHttpRecording} from '../../../helpers/pollyHelper'
import DeviceConnection from '../../../../src/lib/remarkableApi/deviceConnection'
import Session from '../../../../src/lib/remarkableApi/session'
import Snapshot from "../../../../src/lib/remarkableApi/cache/snapshot.js";

describe('Snapshot', () => {
	setupHttpRecording()

	describe('.fromSession', () => {
		it('returns a snapshot of reMarkable cloud account attached to session', async () => {
			const deviceConnection = new DeviceConnection(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			const snapshot = await Snapshot.fromSession(session)

			expect(snapshot).toBeInstanceOf(Snapshot)
			expect(snapshot.root).toBeDefined()
			expect(snapshot.documents).toBeInstanceOf(Array)
			expect(snapshot.folders).toBeInstanceOf(Array)
			expect(snapshot.documents.length).toBeGreaterThan(0)
			expect(snapshot.folders.length).toBeGreaterThan(0)
		}, 100000000)
	})
})
