import CRC32C from 'crc-32/crc32c'
import {fromByteArray} from 'base64-js'

/**
 * Handles request payload being sent to the reMarkable API.
 *
 * Each operation performed
 */
export default class RequestBuffer {
	/**
	 * Data to be sent to the reMarkable API.
	 *
	 * @typedef {String}
	 */
	#payload

	constructor(payload) {
		this.#payload = payload
	}

	/**
	 * Returns the body/payload of a reMarkable API request.
	 *
	 * @returns {String}
	 */
	get payload() {
		return this.#payload
	}

	/**
	 * Returns the payload as a Uint8Array.
	 *
	 * @returns {Uint8Array}
	 */
	get payloadUint8Array() {
		return (new TextEncoder()).encode(this.#payload)
	}

	/**
	 * Returns the payload size in bytes.
	 *
	 * @returns {number}
	 */
	get sizeInBytes() {
		return this.payloadUint8Array.length
	}

	/**
	 * Generates a SHA-256 hash of the payload.
	 *
	 * @returns {Promise<string>}
	 */
	async checksum() {
		const payloadDigest = await crypto.subtle.digest("SHA-256", this.payloadUint8Array)
		return Array.from(new Uint8Array(payloadDigest))
			.map(b => b.toString(16).padStart(2, '0'))
			.join('')
	}

	/**
	 * Generates a CRC32C hash of the payload.
	 *
	 * @returns {string}
	 */
	get crc32Hash() {
		const payloadUint8Array = (new TextEncoder()).encode(this.payload)
		const payloadCrc = CRC32C.buf(payloadUint8Array, 0);
		const crcArrayBuffer = new ArrayBuffer(4)
		new DataView(crcArrayBuffer).setInt32(0, payloadCrc, false)
		return fromByteArray(new Uint8Array(crcArrayBuffer))
	}
}