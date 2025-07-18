import { v4 as uuidv4 } from 'uuid'
import {jwtDecode} from 'jwt-decode'
import DeviceConnection, {
	UnsuccessfulDeviceConnectionPairingError
} from '../../../src/lib/remarkableApi/deviceConnection'
import {
	mockFailedFetchBasedHttpRequest,
	mockSuccessfulFetchBasedHttpRequest
} from '../../helpers/fetchBasedHttpClientHelper.js'

describe('DeviceConnection', () => {
	describe('.from', () => {
		/**
		 * For whatever reason, Polly.js fails to record this call,
		 * so for the test to work I need to disable it here.
		 */
		it('creates remarkable API connection out of one-time-code', async () => {
			const oneTimeCode = 'rsxirjhy'
			const uuid = uuidv4()
			const description = 'browser-chrome'

			const originalFetch = mockSuccessfulFetchBasedHttpRequest(
				`https://my.remarkable.com/api/v1/connection/${oneTimeCode}`,
				global.remarkableDeviceConnectionToken,
				200
			)

			const deviceConnection =
				await DeviceConnection.from(oneTimeCode, uuid, description)

			global.fetch = originalFetch

			expect(deviceConnection).toBeInstanceOf(DeviceConnection)
			expect(deviceConnection.token.replace(/^"(.*)"$/, '$1'))
				.toBe(global.remarkableDeviceConnectionToken)
		})

		it('if pairing fails, throws error', async () => {
			const oneTimeCode = 'rsxirjhy'
			const uuid = uuidv4()
			const description = 'browser-chrome'

			const originalFetch = mockFailedFetchBasedHttpRequest(
				`https://my.remarkable.com/api/v1/connection/${oneTimeCode}`,
			)

			await expect(DeviceConnection.from(oneTimeCode, uuid, description))
				.rejects
				.toThrow(UnsuccessfulDeviceConnectionPairingError)

			global.fetch = originalFetch
		})
	})

	describe('.constructor', () => {
		it('initializes device connection with token data', () => {
			const decodedToken = jwtDecode(global.remarkableDeviceConnectionToken)

			const expectedTokenFields = {
				id: decodedToken['device-id'],
				description: decodedToken['device-desc'],
				issuedAt: new Date(decodedToken.iat * 1000)
			}

			const deviceConnection = new DeviceConnection(global.remarkableDeviceConnectionToken)

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
