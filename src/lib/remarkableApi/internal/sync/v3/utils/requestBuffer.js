import CRC32C from 'crc-32/crc32c'
import {fromByteArray} from 'base64-js'

/**
 * Class that handles data to be sent to the reMarkable API.
 *
 * Each interaction with the reMarkable API requires payload
 * exchanged to be manipulated in a specific way. For example:
 *
 * - 	We need to checksum the payload before sending it to generate
 * 		a new hash which will identify the hash entry being updated
 * 		(metadata, hash entries of a file, etc.).
 * -	We need to generate a CRC32 checksum of the payload to attach
 * 		to each request.
 *
 * This class provides the methods necessary to perform all of these
 * manipulations, providing an easy way to prepare data to be sent
 * to the reMarkable API.
 */
export default class RequestBuffer {
	/**
	 * Data to be sent to the reMarkable API.
	 * @typedef {String}
	 */
	#payload

	constructor(payload) {
		let stringfiedPayload = payload

		if (typeof(payload) === 'object') {
			stringfiedPayload = JSON.stringify(payload)
		}

		this.#payload = stringfiedPayload
	}

	/**
	 * Returns the payload to be sent to the reMarkable API.
	 *
	 * @returns {String}
	 */
	get payload() {
		return this.#payload
	}

	/**
	 * Generates a SHA-256 hash of the payload.
	 *
	 * @returns {Promise<string>}
	 */
	async hash() {
		const payloadUint8Array = (new TextEncoder()).encode(this.payload)
		const payloadDigest = await crypto.subtle.digest("SHA-256", payloadUint8Array)
		return Array.from(new Uint8Array(payloadDigest))
			.map(b => b.toString(16).padStart(2, '0'))
			.join('')
	}

	get crc32Hash() {
		const payloadUint8Array = (new TextEncoder()).encode(this.payload)
		const payloadCrc = CRC32C.buf(payloadUint8Array, 0);
		const crcArrayBuffer = new ArrayBuffer(4)
		new DataView(crcArrayBuffer).setInt32(0, payloadCrc, false)
		return fromByteArray(new Uint8Array(crcArrayBuffer))
	}
}