import {v4 as uuidv4} from 'uuid'
import {File} from '../abstracts/file.js'
import {RequestBuffer} from '../utils/index.js'
import * as Schemas from '../../../schemas/index.js'
import {Metadata} from './Metadata.js'
import {CONFIGURATION} from '../../../../configuration.js'
import {FetchBasedHttpClient} from '../../../../../utils/httpClient/index.js'

export class FolderIncompatibleHashEntriesError extends Error {
	constructor(message = 'The provided hash entries are not compatible with a reMarkable folder.') {
		super(message)
		this.name = 'FolderIncompatibleHashEntriesError'
	}
}

/**
 * Class representing a reMarkable folder.
 *
 * Abstracts the logic for manipulating folders
 * on the reMarkable API, allowing us to rename,
 * delete, or move folders in the reMarkable cloud.
 */
export class Folder extends File {
	/**
	 * Fetches folder hash entries from foloder root
	 * hash entry and returns a Folder instance.
	 *
	 * @param {root} root - reMarkable Cloud root snapshot.
	 * @param {HashEntry} rootHashEntry - The root hash entry representing the folder.
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<Folder>}
	 */
	static async fromHashEntry(root, rootHashEntry, session) {
		const hashEntriesPayload = await rootHashEntry.content(session)

		const hashEntries = Schemas.HashEntriesFactory.fromPayload(hashEntriesPayload)

		return await this.fromHashEntries(root, rootHashEntry, hashEntries, session)
	}

	/**
	 * Returns a Folder instance from the provided
	 * hash entries representing the folder content.
	 *
	 * @param {Root} root - reMarkable Cloud root snapshot.
	 * @param {HashEntry} rootHashEntry - The root hash entry representing the folder.
	 * @param {HashEntries} hashEntries - The hash entries representing the folder content.
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<Folder>}
	 */
	static async fromHashEntries(root, rootHashEntry, hashEntries, session) {
		if (!this.compatibleWithHashEntries(hashEntries)) {
			throw new FolderIncompatibleHashEntriesError()
		}

		const folderMetadataPayload =
			await hashEntries.hashEntriesList
				.find(hashEntry => hashEntry.fileExtension === 'metadata')
				.content(session)

		const folderMetadata = new Metadata(rootHashEntry, folderMetadataPayload)

		return new Folder(root, rootHashEntry, hashEntries, folderMetadata)
	}

	/**
	 * Returns true if the provided hash entries resemble a reMarkable folder.
	 *
	 * @param {HashEntries} hashEntries - The hash entries to check for compatibility.
	 * @returns {boolean}
	 */
	static compatibleWithHashEntries(hashEntries) {
		return 	hashEntries.hashEntriesList.some(hashEntry => hashEntry.fileExtension === 'metadata') &&
						!hashEntries.hashEntriesList.some(hashEntry => hashEntry.fileExtension === 'pagedata') &&
						!hashEntries.hashEntriesList.some(hashEntry => hashEntry.fileExtension === 'pdf') &&
						!hashEntries.hashEntriesList.some(hashEntry => hashEntry.fileExtension === 'epub')
	}

	/**
	 * reMarkable Cloud root snapshot.
	 *
	 * @type {Root}
	 */
	#root

	/**
	 * Hash entry from root hash entries representing the folder.
	 *
	 * @type {HashEntry}
	 */
	#rootHashEntry

	/**
	 * Hash entries representing the folder content.
	 *
	 * @type {HashEntries}
	 */
	#hashEntries

	/**
	 * Folder metadata
	 *
	 * @type {Metadata}
 	 */
	#metadata

	constructor(root, rootHashEntry, hashEntries, metadata) {
		super()

		this.#root = root
		this.#rootHashEntry = rootHashEntry
		this.#hashEntries = hashEntries
		this.#metadata = metadata
	}

	/**
	 * Returns the reMarkable Cloud root snapshot.
	 *
	 * @returns {Root}
	 */
	get root() {
		return this.#root
	}

	/**
	 * Returns root hash entry representing the folder.
	 *
	 * @returns {HashEntry}
	 */
	get rootHashEntry() {
		return this.#rootHashEntry
	}

	/**
	 * Returns hash entries representing the folder content.
	 *
	 * @returns {HashEntries}
	 */
	get hashEntries() {
		return this.#hashEntries
	}

	/**
	 * Returns folder metadata.
	 *
	 * @returns {Metadata}
	 */
	get metadata() {
		return this.#metadata
	}

	/**
	 * Returns the name of the folder.
	 *
	 * @returns {String}
	 */
	get name() {
		return this.metadata.folderName
	}

	/**
	 * Renames the folder in the reMarkable cloud.
	 *
	 * @param {String} newName - The new name for the folder.
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<Folder>}
	 */
	async rename(newName, session) {
		const newFolderMetadataHashEntry =
			await this.metadata.update({ visibleName: newName }, session)

		return await this.updateHashEntryToFileHashEntries(newFolderMetadataHashEntry, session)
	}

	/**
	 * Moves the folder to a specified folder in the reMarkable cloud.
	 *
	 * @param {String} destinationFolderId - The ID of the destination folder.
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<Folder>}
	 */
	async moveToFolder(destinationFolderId, session) {
		const newFolderMetadataHashEntry =
			await this.metadata.update({ parent: destinationFolderId }, session)

		return await this.updateHashEntryToFileHashEntries(newFolderMetadataHashEntry, session)
	}

	/**
	 * Moves the folder to the trash folder in the reMarkable cloud.
	 * This is the equivalent of removing a folder in the reMarkable cloud.
	 *
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<EpubFile>}
	 */
	async moveToTrash(session) {
		return await this.moveToFolder('trash', session)
	}
}
