import CRC32 from 'crc-32'
import {fromByteArray} from 'base64-js'
import HashEntries from './hashEntries'
import FetchBasedHttpClient from "../../../utils/httpClient/fetchBasedHttpClient.js";
import {CONFIGURATION} from "../../configuration.js";

export class PdfIncompatibleHashEntriesError extends Error {}

export default class PdfDocument {
	/**
	 * Creates a PdfDocument instance from a hash entry.
	 * @param {HashEntry} hashEntry
	 * @param {Session} session
	 * @returns {Promise<PdfDocument>}
	 */
	static async fromHashEntry(hashEntry, session) {
		const hashEntriesPayload = await hashEntry.content(session)

		const hashEntries = new HashEntries(hashEntriesPayload)

		return await this.fromHashEntriesResemblingAPdf(hashEntries, session)
	}

	/**
	 * Creates a PdfDocument instance from hash entries that resemble a PDF.
	 * @param {HashEntries} hashEntries
	 * @param {Session} session
	 * @returns {Promise<PdfDocument>}
	 */
	static async fromHashEntriesResemblingAPdf(hashEntries, session) {
		if (
			!hashEntries.hashEntriesList.some(hashEntry => hashEntry.fileExtension === 'metadata') ||
			!hashEntries.hashEntriesList.some(hashEntry => hashEntry.fileExtension === 'pagedata') ||
			!hashEntries.hashEntriesList.some(hashEntry => hashEntry.fileExtension === 'content') ||
			hashEntries.hashEntriesList.some(hashEntry => hashEntry.fileExtension === 'epub')
		) {
			throw new PdfIncompatibleHashEntriesError()
		}

		const pdfMetadata =
			await hashEntries
				.hashEntriesList
				.find(hashEntry => hashEntry.fileExtension === 'metadata')
				.content(session)

		return new PdfDocument(
			hashEntries.fileId,
			hashEntries,
			pdfMetadata
		)
	}

	/**
	 * PDF file unique UUID identifier.
	 */
	#fileId

	/**
	 * Hash entries representing the PDF file.
	 */
	#hashEntries

	/**
	 * PDF file metadata.
	 */
	#metadata

	constructor(fileId, hashEntries, metadata) {
		this.#fileId = fileId
		this.#hashEntries = hashEntries
		this.#metadata = metadata
	}

	/**
	 * Returns the unique UUID identifier of the PDF file.
	 * @returns {string}
	 */
	get fileId() {
		return this.#fileId
	}

	/**
	 * Returns the hash entries representing the PDF file.
	 * @returns {HashEntries}
	 */
	get hashEntries() {
		return this.#hashEntries
	}

	/**
	 * Returns the metadata of the PDF file.
	 * @returns {Object}
	 */
	get metadata() {
		return this.#metadata
	}

	/**
	 * Returns the unique UUID identifier of the folder containing the PDF file.
	 * @returns {string}
	 */
	get parentFileId() {
		return this.#metadata.parent
	}

	/**
	 * Returns the name of the PDF file.
	 * @returns {string}
	 */
	get name() {
		return this.#metadata.visibleName
	}

	async rename(newName, session) {
		const pdfMetadataAfterRename = Object.assign(this.#metadata, {visibleName: newName})

		const serializedMetadata = JSON.stringify(pdfMetadataAfterRename)
		const encodedMetadata = new TextEncoder().encode(serializedMetadata)
		const crc = CRC32.buf(encodedMetadata, 0)
		const buff = new ArrayBuffer(4)
		new DataView(buff).setInt32(0, crc, false)
		const crcHash = fromByteArray(new Uint8Array(buff))
		const hash = await this.digest(encodedMetadata)

		console.log(encodedMetadata)
		const renameResponse = await FetchBasedHttpClient.put(
			CONFIGURATION.endpoints.sync.v3.endpoints.files + hash,
			encodedMetadata,
			{
				'Authorization': `Bearer ${session.token}`,
				'rm-filename': newName,
				'x-goog-hash': `crc32c=${crcHash}`
			}
		)
	}

	async digest(buff) {
		const digest = await crypto.subtle.digest("SHA-256", buff);
		return [...new Uint8Array(digest)]
			.map((x) => x.toString(16).padStart(2, "0"))
			.join("")
	}
}