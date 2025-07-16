import { v4 as uuidv4 } from 'uuid'
import DeviceConnection, {REMARKABLE_JWT_MAPPING} from '../../../src/lib/remarkableApi/deviceConnection'
import {mockSuccessfulFetchBasedHttpRequest} from '../../helpers/fetchBasedHttpClientHelper.js';
import {jwtDecode} from "jwt-decode";

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

			mockSuccessfulFetchBasedHttpRequest(
				`https://my.remarkable.com/api/v1/connection/${oneTimeCode}`,
				global.remarkableToken,
				200
			)

			const deviceConnection =
				await DeviceConnection.from(oneTimeCode, uuid, description)

			expect(deviceConnection).toBeInstanceOf(DeviceConnection)
			expect(deviceConnection.token.replace(/^"(.*)"$/, '$1'))
				.toBe(global.remarkableToken)
		}, 50000)
	})

	describe('.constructor', () => {
		it('initializes device connection with token data', () => {
			const decodedToken = jwtDecode(global.remarkableToken)

			const expectedTokenFields = {
				id: decodedToken[REMARKABLE_JWT_MAPPING.id],
				description: decodedToken[REMARKABLE_JWT_MAPPING.description],
				issuedAt: new Date(decodedToken.iat * 1000)
			}

			const deviceConnection = new DeviceConnection(global.remarkableToken)

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
