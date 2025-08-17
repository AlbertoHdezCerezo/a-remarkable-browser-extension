import {HashEntriesFactory, HashEntryFactory} from '../internal/schemas/index'
import ApiFolder from '../internal/sync/v3/files/folder/folder'

export default class Folder {
	/**
	 * Returns a Folder instance from the provided
	 * JSON representation of the folder.
	 *
	 * @param {String} folderJson - JSON representation of the folder.
	 * @param {Root} root - reMarkable Cloud root.
	 * @returns {Folder}
	 */
	static fromJson(folderJson, root) {
		const folderObject = JSON.parse(folderJson)
		const folderRootHashEntry = HashEntryFactory.fromPayload(folderObject.folderRootHashEntryPayload)
		const folderHashEntries = HashEntriesFactory.fromPayload(folderObject.folderHashEntriesPayload)
		const folderMetadataPayload = folderObject.folderMetadataPayload

		let apiFolder = null
		if (folderHashEntries.resemblesAFolder) {
			apiFolder = new ApiFolder(
				root,
				folderRootHashEntry,
				folderHashEntries,
				folderMetadataPayload
			)
		} else {
			throw new Error('Unsupported folder type')
		}

		return new Folder(apiFolder)
	}

	/**
	 * Folder from the reMarkable cloud API.
	 *
	 * @type {Folder}
	 */
	#apiFolder

	constructor(apiFolder) {
		this.#apiFolder = apiFolder
	}

	/**
	 * Returns the API folder object
	 *
	 * @returns {ApiFolder}
	 */
	get apiFolder() {
		return this.#apiFolder
	}

	/**
	 * Serializes document to JSON format.
	 *
	 * @returns {String}
	 */
	get toJson() {
		return JSON.stringify(
			{
				folderRootHashEntryPayload: this.#apiFolder.rootHashEntry.payload,
				folderHashEntriesPayload: this.#apiFolder.hashEntries.payload,
				folderMetadataPayload: this.#apiFolder.metadata.payload
			}
		)
	}
}
