import Root from '../internal/sync/root'
import {HashEntriesFactory} from "../internal/schemas/index.js";
import FileFactory from "../internal/sync/fileFactory.js";

const SNAPSHOT_DOWNLOAD_BATCH_SIZE = 20
const SNAPSHOT_DOWNLOAD_BATCH_DELAY = 5

export default class Snapshot {
	static async fromDeviceConnection(deviceConnection, session) {
		const root = await Root.fromDeviceConnection(deviceConnection, session)

		let snapshotDocumentsAndFolders = []

		for (let index = 0; index < root.hashEntries.length; index += SNAPSHOT_DOWNLOAD_BATCH_SIZE) {
			const hashEntriesBatch = root.hashEntries.slice(index, index + SNAPSHOT_DOWNLOAD_BATCH_SIZE)

			const documentsAndFoldersRawHashEntriesInBatch =
				await Promise.all(hashEntriesBatch.map(async hashEntry => await hashEntry.content(session)))

			const documentsAndFoldersHashEntries =
				documentsAndFoldersRawHashEntriesInBatch
					.map(rawHashEntries => HashEntriesFactory.fromPayload(rawHashEntries))

			snapshotDocumentsAndFolders = snapshotDocumentsAndFolders.concat(
				await Promise.all(
					documentsAndFoldersHashEntries.map(
						async (hashEntries, index) => await FileFactory.fileFromHashEntries(
							root,
							root.hashEntries[index],
							hashEntries,
							session
						)
					)
				)
			)

			await new Promise(resolve => setTimeout(resolve, SNAPSHOT_DOWNLOAD_BATCH_DELAY * 1000))
		}
	}

	/**
	 * Snapshot of the reMarkable cloud
	 * file system, consisting of the
	 * hash entries of all the files
	 * and folders in the account.
	 *
	 * @type {Root}
	 */
	#root

	/**
	 * Collection of cached documents
	 * (pdfs, epubs, etc.) and in the
	 * current snapshot.
	 *
	 * @type {Array<Document>}
	 */
	#documents

	/**
	 * Collection of cached folders
	 * in the current snapshot.
	 *
	 * @type {Array<Folder>}
	 */
	#folders

	constructor(root, documents = [], folders = []) {
		this.#root = root
		this.#documents = documents
		this.#folders = folders
	}

	/**
	 * Returns the root of the current snapshot.
	 *
	 * @returns {Root}
	 */
	get root() {
		return this.#root
	}

	/**
	 * Returns the documents in the current snapshot.
	 * Documents are cached and can be used to access
	 * the files in the reMarkable cloud account.
	 *
	 * @returns {Array<Document>}
	 */
	get documents() {
		return this.#documents
	}

	/**
	 * Returns the folders in the current snapshot.
	 * Folders are cached and can be used to navigate
	 * the file system.
	 *
	 * @returns {Array<Folder>}
	 */
	get folders() {
		return this.#folders
	}
}