import {FetchBasedHttpClient} from '../../../../../utils/httpClient'
import {CONFIGURATION} from '../../../../configuration.js'
import * as Schemas from '../../../schemas'
import {RequestBuffer} from '../utils'
import {Root} from '../Root.js'

/**
 * Abstract class representing a file
 * or folder in the Remarkable API.
 *
 * Abstracts the logic for handling
 * documents and folders across
 * the Remarkable API data models.
 */
export class File {
	static async fromHashEntry(rootHashEntry, session) {
		throw new Error('Method fromHashEntry() must be implemented')
	}

	static async fromHashEntries(rootHashEntry, session) {
		throw new Error('Method fromHashEntry() must be implemented')
	}

	static compatibleWithHashEntries(hashEntries) {
		throw new Error('Method compatibleWithHashEntries() must be implemented')
	}

	/**
	 * Hash entry from root hash entries representing the Document.
	 *
	 * @type {HashEntry}
	 */
	#rootHashEntry

	/**
	 * Hash entries representing the Document content.
	 *
	 * @type {HashEntries}
	 */
	#hashEntries

	/**
	 * PDF file metadata
	 */
	#metadata

	constructor(rootHashEntry, hashEntries, metadata) {
		this.#rootHashEntry = rootHashEntry
		this.#hashEntries = hashEntries
		this.#metadata = metadata
	}

	/**
	 * Returns root hash entry representing the Document.
	 *
	 * @returns {HashEntry}
	 */
	get rootHashEntry() {
		return this.#rootHashEntry
	}

	/**
	 * Returns hash entries representing the Document content.
	 *
	 * @returns {HashEntries}
	 */
	get hashEntries() {
		return this.#hashEntries
	}

	/**
	 * Returns Document metadata.
	 *
	 * @returns {Metadata}
	 */
	get metadata() {
		return this.#metadata
	}

	/**
	 * Returns the file extension of the file/folder.
	 *
	 * @returns {String}
	 */
	get extension() {
		throw new Error('Method name() must be implemented')
	}

	/**
	 * Returns the file name of the file/folder.
	 *
	 * @returns {String}
	 */
	get name() {
		throw new Error('Method name() must be implemented')
	}

	/**
	 * Renames the Document in the reMarkable cloud.
	 *
	 * @param {String} newName - The new name for the PDF file.
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<File>}
	 */
	async rename(newName, session) {
		return this.#upsertFileMetadata({ visibleName: newName }, session)
	}

	/**
	 * Moves the Document to a specified folder in the reMarkable cloud.
	 *
	 * @param {String} destinationFolderId - The ID of the destination folder.
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<Document>}
	 */
	async moveToFolder(destinationFolderId, session) {
		return this.#upsertFileMetadata({ parent: destinationFolderId }, session)
	}

	/**
	 * Moves the Document to the trash folder in the reMarkable cloud.
	 * This is the equivalent of removing a file in the reMarkable cloud.
	 *
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<Document>}
	 */
	async moveToTrash(session) {
		return this.moveToFolder('trash', session)
	}

	/**
	 * Updates File metadata, already present in the reMarkable cloud
	 * account, with the new metadata payload. This process has multiple
	 * steps, in which the file hash entries and the root hash entries
	 * are updated to reflect the new metadata payload, to then generate
	 * a new root generation, which will become the new default root,
	 * containing those new hash entries.
	 *
	 * @param {Object} newFileMetadataPayload - The new metadata payload to update the file with.
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<File>}
	 */
	async #upsertFileMetadata(newFileMetadataPayload, session) {
		const newFileMetadataHashEntry =
			await this.metadata.update(newFileMetadataPayload, session)

		const currentFileMetadataHashEntry =
			this.hashEntries.hashEntriesList.find(entry => entry.fileExtension === 'metadata')

		const updatedFileHashEntries =
			this.hashEntries.replace(currentFileMetadataHashEntry, newFileMetadataHashEntry)

		const updatedFileRootHashEntry = await this.#commitFileHashEntries(updatedFileHashEntries, session)

		const currentRoot = await Root.fromSession(session)

		const currentFileRootHashEntry =
			currentRoot.hashEntries.hashEntriesList.some(hashEntry => hashEntry.fileId === updatedFileRootHashEntry.fileId)

		if (currentFileRootHashEntry === undefined) throw new Error('File already exists')

		const newRootHashEntries =
			currentRoot.hashEntries.replace(currentFileRootHashEntry, updatedFileRootHashEntry)

		await this.#commitRootHashEntries(newRootHashEntries, session)
		await this.#setNewDefaultRootGeneration(currentRoot, newRootHashEntries, session)
		return this.refreshFile(session)
	}

	/**
	 * Commits the provided file hash entries to the reMarkable cloud.
	 * To make file hash entries synchronized with current file, the
	 * root hash entries must be updated to point to the new file hash entry,
	 * and this new root hash entry must be set as the default root generation.
	 *
	 * @param {HashEntries} fileHashEntries - The file hash entries to commit.
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<Response>}
	 */
	async #commitFileHashEntries(fileHashEntries, session) {
		const fileRootHashEntry = await fileHashEntries.hashEntry()
		const hashEntriesChecksum = await fileHashEntries.checksum()
		const hashEntriesBuffer = fileHashEntries.asRequestBuffer()

		const requestHeaders = {
			'authorization': `Bearer ${session.token}`,
			'content-type': 'text/plain; charset=UTF-8',
			'rm-filename': `${fileRootHashEntry.fileId}.docSchema`,
			'x-goog-hash': `crc32c=${hashEntriesBuffer.crc32Hash}`,
		}

		return FetchBasedHttpClient.put(
			CONFIGURATION.endpoints.sync.v3.endpoints.files + hashEntriesChecksum,
			hashEntriesBuffer.payload,
			requestHeaders
		)
	}

	/**
	 * Commits the provided root hash entries to the reMarkable cloud.
	 * This creates a new hash entry in the reMarkable cloud account.
	 * To make it the default root, a new root generation must be created
	 * pointing to the new root hash entry.
	 *
	 * @param {HashEntries} rootHashEntries - The root hash entries to commit.
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<Response>}
	 */
	async #commitRootHashEntries(rootHashEntries, session) {
		const hashEntriesBuffer = rootHashEntries.asRequestBuffer()
		const hashEntriesChecksum = await rootHashEntries.checksum()

		const updateRequestHeaders = {
			'authorization': `Bearer ${session.token}`,
			'content-type': 'text/plain; charset=UTF-8',
			'rm-filename': `root.docSchema`,
			'x-goog-hash': `crc32c=${hashEntriesBuffer.crc32Hash}`,
		}

		return FetchBasedHttpClient.put(
			CONFIGURATION.endpoints.sync.v3.endpoints.files + hashEntriesChecksum,
			hashEntriesBuffer.payload,
			updateRequestHeaders,
		)
	}

	/**
	 *
	 * @param {Root} currentDefaultRoot - Current default root in reMarkable cloud account.
	 * @param {HashEntries} newDefaultRootHashEntries - New root hash entries to set as default.
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<Response>}
	 */
	async #setNewDefaultRootGeneration(currentDefaultRoot, newDefaultRootHashEntries, session) {
		const newRootGenerationPayload = {
			broadcast: true,
			generation: currentDefaultRoot.generation,
			hash: await newDefaultRootHashEntries.checksum()
		}

		const newRootBuffer = new RequestBuffer(newRootGenerationPayload)

		const updateRequestHeaders = {
			'authorization': `Bearer ${session.token}`,
			'content-type': 'application/json',
			'rm-filename': `roothash`,
			'x-goog-hash': `crc32c=${newRootBuffer.crc32Hash}`,
		}

		return FetchBasedHttpClient.put(
			CONFIGURATION.endpoints.sync.v3.endpoints.root,
			newRootGenerationPayload,
			updateRequestHeaders
		)
	}

	/**
	 * Updates file attributes to synchronize them with
	 * the current version available in the reMarkable cloud.
	 *
	 * @param session
	 * @returns {Promise<File>}
	 */
	async refreshFile(session) {
		throw new Error('Method refreshFile() must be implemented')
	}
}