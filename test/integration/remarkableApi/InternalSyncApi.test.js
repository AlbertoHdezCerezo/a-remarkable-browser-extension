import {setupHttpRecording} from '../../helpers/pollyHelper.js'
import * as Sync from '../../../src/lib/remarkableApi/internal/sync'

describe('eu.tectonic.remarkable.com/sync/v3/root', () => {
	const session = global.remarkableApiSession

	setupHttpRecording()

	describe('GET - Load reMarkable Cloud Root & Hash Entries', () => {
		it('Load reMarkable Cloud Root & Hash Entries', async () => {
			const root = await Sync.Root.fromSession(session)

			expect(root).toBeInstanceOf(Sync.Root)
			expect(root.checksum).toBeDefined()
			expect(root.generation).toBeDefined()
			expect(root.hashEntries).toBeDefined()
			expect(root.hashEntries.hashEntriesList.length).toBeGreaterThan(0)
		}, 1000000000)
	})
})

