import { jest } from '@jest/globals'
import {jwtDecode} from 'jwt-decode'
import {setupHttpRecording} from '../../../../helpers/pollyHelper.js'
import Session, {UnsuccessfulSessionAuthenticationError} from '../../../../../src/lib/remarkableApi/internal/token/session.js'
import Device from '../../../../../src/lib/remarkableApi/internal/token/device.js'

describe('Session', () => {
	setupHttpRecording()

	describe('.from', () => {
		it('creates remarkable API session out of device connection token', async () => {
			const deviceConnection = new Device(global.remarkableDeviceToken)

			const session = await Session.from(deviceConnection)

			expect(session).toBeInstanceOf(Session)
		}, 50000)

		it('if authentication fails, throws error', async () => {
			const deviceConnection = new Device(global.remarkableSessionToken)

			await expect(Session.from(deviceConnection))
				.rejects
				.toThrow(UnsuccessfulSessionAuthenticationError)
		})
	})
	
	describe('.constructor', () => {
		it('initializes session with token data', () => {
			const decodedToken = jwtDecode(global.remarkableSessionToken)

			const expectedTokenFields = {
				deviceId: decodedToken['device-id'],
				expiredAt: new Date(decodedToken.exp * 1000)
			}

			const session = new Session(global.remarkableSessionToken)

			const actualTokenFields = {
				deviceId: session.deviceId,
				expiredAt: session.expiredAt
			}

			expect(actualTokenFields).toEqual(expectedTokenFields)
		})
	})

	describe('#expired', () => {
		it('returns true when token expiration timestamp is over', () => {
			const session = new Session(global.remarkableSessionToken)
			const timestampBeforeExpiration = session.expiredAt.getTime() - 1000
			const timestampAfterExpiration = session.expiredAt.getTime() + 1000

			jest.spyOn(Date, 'now').mockReturnValueOnce(timestampBeforeExpiration)
			expect(session.expired).toBe(false)

			jest.spyOn(Date, 'now').mockReturnValueOnce(timestampAfterExpiration)
			expect(session.expired).toBe(true)
		})
	})
})
