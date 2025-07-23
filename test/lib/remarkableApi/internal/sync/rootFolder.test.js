import {setupHttpRecording} from '../../../../helpers/pollyHelper'
import Session from '../../../../../src/lib/remarkableApi/session'
import DeviceConnection from '../../../../../src/lib/remarkableApi/deviceConnection'
import RootFolder from '../../../../../src/lib/remarkableApi/internal/sync/rootFolder'
import HashEntries from '../../../../../src/lib/remarkableApi/internal/sync/hashEntries'

describe('RootFolder', () => {
	setupHttpRecording()

	describe('.fromRootEndpoint', () => {
		it('given a file buffer with a compatible extension, uploads it to the device', async () => {
			const deviceConnection = new DeviceConnection(global.remarkableDeviceConnectionToken)
			const session = await Session.from(deviceConnection)

			const rootFolder = await RootFolder.fromRootEndpoint(session)

			expect(rootFolder).toBeDefined()
			expect(rootFolder).toHaveProperty('hashEntries')
			expect(rootFolder.hashEntries).toBeInstanceOf(HashEntries)
			expect(rootFolder).toHaveProperty('session')
			expect(rootFolder.session).toBe(session)
		})
	})
})