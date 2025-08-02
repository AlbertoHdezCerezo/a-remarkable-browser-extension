import {setupHttpRecording} from '../../../../../helpers/pollyHelper'
import DeviceConnection from '../../../../../../src/lib/remarkableApi/deviceConnection'
import Session from '../../../../../../src/lib/remarkableApi/session'
import Root from '../../../../../../src/lib/remarkableApi/internal/sync/root'

describe('Root', () => {
	setupHttpRecording()

	describe('.fromSession', () => {
		it('fetches root information and hash entries from the reMarkable cloud account', async () => {
			const deviceConnection = new DeviceConnection(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			const root = await Root.fromSession(session)

			expect(root).toBeDefined()
			expect(root.hash).toBeDefined()
			expect(root.generation).toBeDefined()
			expect(root.hashEntries).toBeDefined()
		})
	})
})