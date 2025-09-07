import {File} from '../abstracts/file.js'
import {Metadata} from './Metadata.js'

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
	 * @param {HashEntry} rootHashEntry - The root hash entry representing the folder.
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<Folder>}
	 */
	static async fromHashEntry(rootHashEntry, session) {
		const hashEntriesPayload = await rootHashEntry.content(session)

		return await this.fromHashEntries(rootHashEntry, Schemas.HashEntriesFactory.fromPayload(hashEntriesPayload), session)
	}

	/**
	 * Returns a Folder instance from the provided
	 * hash entries representing the folder content.
	 *
	 * @param {HashEntry} rootHashEntry - The root hash entry representing the folder.
	 * @param {HashEntries} hashEntries - The hash entries representing the folder content.
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<Folder>}
	 */
	static async fromHashEntries(rootHashEntry, hashEntries, session) {
		if (!this.compatibleWithHashEntries(hashEntries)) {
			throw new FolderIncompatibleHashEntriesError()
		}

		const folderMetadataPayload =
			await hashEntries.hashEntriesList
				.find(hashEntry => hashEntry.fileExtension === 'metadata')
				.content(session)

		const folderMetadata = new Metadata(rootHashEntry, folderMetadataPayload)

		return new Folder(rootHashEntry, hashEntries, folderMetadata)
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
	 * Returns the name of the folder.
	 *
	 * @returns {String}
	 */
	get name() {
		return this.metadata.folderName
	}

	/**
	 * Returns 'folder'.
	 *
	 * @returns {String}
	 */
	get extension() {
		return 'folder'
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
