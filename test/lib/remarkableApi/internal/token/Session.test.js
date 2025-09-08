import {expect, jest} from '@jest/globals'
import {jwtDecode} from 'jwt-decode'
import {mockSessionRequest} from '../../../../helpers/remarkableApiHelper.js'
import {FetchBasedHttpClient} from '../../../../../src/lib/utils/httpClient'
import {
	Session,
	UnsuccessfulSessionAuthenticationError
} from '../../../../../src/lib/remarkableApi/internal/token/Session.js'

describe('Session', () => {
	let device = global.remarkableDevice

	describe('.from', () => {
		it('creates remarkable API session out of device connection token', async () => {
			const fetchBasedHttpClientPostMock = jest.fn()
			mockSessionRequest(
				global.remarkableDeviceToken,
				global.remarkableSessionToken,
				fetchBasedHttpClientPostMock
			)
			FetchBasedHttpClient.post = fetchBasedHttpClientPostMock

			const session = await Session.from(device)

			expect(session).toBeInstanceOf(Session)
		})

		it('if authentication fails, throws error', async () => {
			const fetchBasedHttpClientPostMock = jest.fn()
			fetchBasedHttpClientPostMock
				.mockImplementationOnce((...args) => {
					return Promise.resolve({ok: false, status: 401})
				})
			FetchBasedHttpClient.post = fetchBasedHttpClientPostMock

			try {
				await Session.from(device)
			} catch (error) {
				expect(error).toBeInstanceOf(UnsuccessfulSessionAuthenticationError)
			}
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
