/**
 * The reMarkable API only works with `.pdf` and `.epub` files. This error is
 * raised when an `Buffer` with an unsupported file extension is passed to
 * the `FileBufferType` class.
 */
export class UnsupportedFileExtensionError extends Error {}

/**
 * Each `Buffer` presents a specific signature representing its corresponding
 * file type at the beginning. This constants list the signature for each one of
 * the supported file types.
 */
const BUFFER_TYPE_SIGNATURES = {
	pdf: [0x25, 0x50, 0x44, 0x46],
	epub: [0x50, 0x4b, 0x03, 0x04]
}

/**
 * Maps each file type to its corresponding MIME type.
 */
const MIME_TYPE_MAPS = {
	pdf: 'application/pdf',
	epub: 'application/epub+zip'
}

/**
 * Represents a file content in a buffer-format compatible
 * with the reMarkable API internal API for file uploads.
 */
export default class FileBuffer {
	/**
	 * Given a buffer representing a file content,
	 * determines the file type based on its
	 * signature at the beginning of the buffer.
	 *
	 * @param {Buffer} buffer - The buffer representing the file content.
	 * @returns {string} - pdf | epub, depending on the file type.
	 */
	static extension (buffer) {
		const signature = (new Uint8Array(buffer)).slice(0, 4)

		for (const [type, sig] of Object.entries(BUFFER_TYPE_SIGNATURES)) {
			if (signature.every((byte, index) => byte === sig[index])) {
				return type
			}
		}

		throw new UnsupportedFileExtensionError()
	}

	/**
	 * Returns the MIME type of the file
	 * based on its buffer extension.
	 *
	 * @param {Buffer} buffer - The buffer representing the file content.
	 * @returns {string} - The MIME type of the file, e.g., application/pdf or application/epub+zip.
	 */
	static mimeType (buffer) {
		const type = this.extension(buffer)
		return MIME_TYPE_MAPS[type]
	}

	/**
	 * Buffer representing the file content
	 * @type {Buffer}
	 */
	#buffer

	/**
	 * Buffer's file extension
	 * @type {string}
	 */
	#extension

	/**
	 * Buffer's MIME type, used for HTTP requests
	 * @type {string}
	 */
	#mimeType

	constructor(buffer) {
		this.#buffer = buffer
		this.#extension = FileBuffer.extension(buffer)
		this.#mimeType = FileBuffer.mimeType(buffer)
	}

	/**
	 * Returns the buffer representing the file content.
	 * @returns {Buffer}
	 */
	get buffer() {
		return this.#buffer
	}

	/**
	 * Returns the file extension of the buffer.
	 * @returns {string} - pdf | epub
	 */
	get extension() {
		return this.#extension
	}

	/**
	 * Returns the MIME type of the buffer.
	 * @returns {string} - application/pdf | application/epub+zip
	 */
	get mimeType() {
		return this.#mimeType
	}
}