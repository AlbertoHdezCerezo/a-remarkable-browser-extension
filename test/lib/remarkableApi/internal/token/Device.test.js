import {jest} from '@jest/globals'
import {v4 as uuidv4} from 'uuid'
import {jwtDecode} from 'jwt-decode'
import {mockDeviceRequest,} from '../../../../helpers/remarkableApiHelper'
import {
	Device,
	UnsuccessfulDeviceConnectionPairingError
} from '../../../../../src/lib/remarkableApi/internal/token/Device.js'
import {FetchBasedHttpClient} from '../../../../../src/lib/utils/httpClient'

describe('Device', () => {
	describe('.from', () => {
		const devicePayload = {
			code: 'TEST-CODE',
			deviceID: uuidv4(),
			deviceDesc: 'browser-chrome',
		}

		/**
		 * For whatever reason, Polly.js fails to record this call,
		 * so for the test to work I need to disable it here.
		 */
		it('creates remarkable API connection out of one-time-code', async () => {
			const fetchBasedHttpClientPostMock = jest.fn()
			mockDeviceRequest(
				devicePayload,
				global.remarkableDeviceToken,
				fetchBasedHttpClientPostMock
			)
			FetchBasedHttpClient.post = fetchBasedHttpClientPostMock

			const deviceConnection =
				await Device.from(devicePayload.code, devicePayload.deviceID, devicePayload.deviceDesc)

			expect(deviceConnection).toBeInstanceOf(Device)
			expect(deviceConnection.token.replace(/^"(.*)"$/, '$1'))
				.toBe(global.remarkableDeviceToken)
		})

		it('if pairing fails, throws error', async () => {
			const fetchBasedHttpClientPostMock = jest.fn()
			fetchBasedHttpClientPostMock
				.mockImplementationOnce((...args) => {
					return Promise.resolve({ok: false, status: 401})
				})
			FetchBasedHttpClient.post = fetchBasedHttpClientPostMock

			try {
				await Device.from(devicePayload.code, devicePayload.id, devicePayload.deviceDesc)
			} catch (error) {
				expect(error).toBeInstanceOf(UnsuccessfulDeviceConnectionPairingError)
			}
		})
	})

	describe('.constructor', () => {
		it('initializes device connection with token data', () => {
			const decodedToken = jwtDecode(global.remarkableDeviceToken)

			const expectedTokenFields = {
				id: decodedToken['device-id'],
				description: decodedToken['device-desc'],
				issuedAt: new Date(decodedToken.iat * 1000)
			}

			const deviceConnection = new Device(global.remarkableDeviceToken)

			const actualTokenFields = {
				id: deviceConnection.id,
				description: deviceConnection.description,
				issuedAt: deviceConnection.issuedAt,
				expiredAt: deviceConnection.expiredAt
			}

			expect(actualTokenFields).toEqual(expectedTokenFields)
		})
	})
})
