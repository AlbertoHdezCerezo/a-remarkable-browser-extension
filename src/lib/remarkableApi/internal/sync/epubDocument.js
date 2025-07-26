import HashEntries from './hashEntries'

export class EpubIncompatibleHashEntriesError extends Error {}

export default class EpubDocument {
	/**
	 * Creates a EpubDocument instance from a hash entry.
	 * @param {HashEntry} hashEntry
	 * @param {Session} session
	 * @returns {Promise<EpubDocument>}
	 */
	static async fromHashEntry(hashEntry, session) {
		const hashEntriesPayload = await hashEntry.content(session)

		const hashEntries = new HashEntries(hashEntriesPayload)

		return await this.fromHashEntriesResemblingAnEpub(hashEntries, session)
	}

	/**
	 * Creates a EpubDocument instance from hash entries that resemble a PDF.
	 * @param {HashEntries} hashEntries
	 * @param {Session} session
	 * @returns {Promise<EpubDocument>}
	 */
	static async fromHashEntriesResemblingAnEpub(hashEntries, session) {
		if (
			!hashEntries.hashEntriesList.some(hashEntry => hashEntry.fileExtension === 'metadata') ||
			!hashEntries.hashEntriesList.some(hashEntry => hashEntry.fileExtension === 'pagedata') ||
			!hashEntries.hashEntriesList.some(hashEntry => hashEntry.fileExtension === 'content') ||
			!hashEntries.hashEntriesList.some(hashEntry => hashEntry.fileExtension === 'epub')
		) {
			throw new EpubIncompatibleHashEntriesError()
		}

		const ePubMetadata =
			await hashEntries
				.hashEntriesList
				.find(hashEntry => hashEntry.fileExtension === 'metadata')
				.content(session)

		return new EpubDocument(
			hashEntries.fileId,
			hashEntries,
			ePubMetadata
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
	 * Returns the unique UUID identifier of the ePub file.
	 * @returns {string}
	 */
	get fileId() {
		return this.#fileId
	}

	/**
	 * Returns the hash entries representing the ePub file.
	 * @returns {HashEntries}
	 */
	get hashEntries() {
		return this.#hashEntries
	}

	/**
	 * Returns the metadata of the ePub file.
	 * @returns {Object}
	 */
	get metadata() {
		return this.#metadata
	}

	/**
	 * Returns the unique UUID identifier of the folder containing the ePub file.
	 * @returns {string}
	 */
	get parentFileId() {
		return this.#metadata.parent
	}

	/**
	 * Returns the name of the ePub file.
	 * @returns {string}
	 */
	get name() {
		return this.#metadata.visibleName
	}
}