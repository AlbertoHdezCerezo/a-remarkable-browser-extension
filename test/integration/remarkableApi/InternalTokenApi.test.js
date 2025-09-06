import {setupHttpRecording} from '../../helpers/pollyHelper.js'
import * as Token from '../../../src/lib/remarkableApi/internal/token'

describe('webapp-prod.cloud.remarkable.engineering/token/json/2/user/new', () => {
	setupHttpRecording()

	describe('POST - Requests new session token', () => {
		it('given an active device, requests new session token', async () => {
			const session = await Token.Session.from(global.remarkableDevice)

			expect(session).toBeInstanceOf(Token.Session)
		}, 1000000000)
	})
})

