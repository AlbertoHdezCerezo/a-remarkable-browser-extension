import { jest } from '@jest/globals'
import {jwtDecode} from 'jwt-decode'
import {setupHttpRecording} from '../../helpers/pollyHelper'
import Session from '../../../src/lib/remarkableApi/session'
import DeviceConnection from '../../../src/lib/remarkableApi/deviceConnection.js'

describe('Session', () => {
	setupHttpRecording()

	describe('.from', () => {
		it('creates remarkable API session out of device connection token', async () => {
			const deviceConnection = new DeviceConnection(global.remarkableDeviceConnectionToken)

			const session = await Session.from(deviceConnection)

			expect(session).toBeInstanceOf(Session)
		}, 50000)
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
				deviceId: session.deviceConnectionId,
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
