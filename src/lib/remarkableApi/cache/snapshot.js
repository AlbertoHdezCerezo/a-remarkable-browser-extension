import * as Internal from '../internal'
import {Folder} from './folder'
import {Document} from './document'

const SNAPSHOT_DOWNLOAD_BATCH_SIZE = 25
const SNAPSHOT_DOWNLOAD_BATCH_DELAY_IN_MS = 0

/**
 * Represents a cacheable snapshot of the
 * reMarkable cloud API file system.
 *
 * This class acts a wrapper of a `Root`
 * object and the folders and documents
 * underneath it, with methods to serialize
 * and deserialize the snapshot, so it can
 * be persisted and reused.
 *
 * The snapshot allows the applications to
 * keep track of the files and folders in
 * a reMarkable cloud account, without the
 * need to fetch the entire file system
 * every time the application starts.
 *
 * The cache can be compared and updated
 * against new root hash entries, identifying
 * the entries that have been modified, and
 * updating those within the same snapshot,
 * without the need to download the entire
 * file system again.
 */
export default class Snapshot {
	/**
	 * Returns a Snapshot instance from the provided
	 * JSON representation of the snapshot.
	 *
	 * @param {Object} snapshotJson - JSON representation of the snapshot.
	 */
	static fromJson(snapshotJson) {
		const snapshotObject = JSON.parse(snapshotJson)

		const snapshotRoot = new Internal.Sync.Root(
			snapshotObject.rootChecksum,
			snapshotObject.rootGeneration,
			snapshotObject.rootHashEntriesPayload
		)

		const snapshotDocuments = snapshotObject.documents.map(documentJson => Document.fromJson(documentJson, snapshotRoot))
		const snapshotFolders = snapshotObject.folders.map(folderJson => Folder.fromJson(folderJson, snapshotRoot))

		return new Snapshot(snapshotRoot, snapshotDocuments, snapshotFolders)
	}

	/**
	 * Fetches current snapshot of the reMarkable
	 * cloud API file system, by fetching the root
	 * hash entries and downloading the documents
	 * and folders associated to the hash entries.
	 *
	 * @param {Session} session
	 * @returns {Promise<Snapshot>}
	 */
	static async fromSession(session) {
		const root = await Root.fromSession(session)

		let snapshotDocumentsAndFolders = []

		for (let index = 0; index < root.hashEntries.hashEntriesList.length; index += SNAPSHOT_DOWNLOAD_BATCH_SIZE) {
			const hashEntriesBatch = root.hashEntries.hashEntriesList.slice(index, index + SNAPSHOT_DOWNLOAD_BATCH_SIZE)

			const documentsAndFoldersRawHashEntriesInBatch =
				await Promise.all(hashEntriesBatch.map(async hashEntry => await hashEntry.content(session)))

			const documentsAndFoldersHashEntries =
				documentsAndFoldersRawHashEntriesInBatch
					.map(rawHashEntries => Internal.Schemas.HashEntriesFactory.fromPayload(rawHashEntries))

			await Promise.all(
				documentsAndFoldersHashEntries.map(
					async (hashEntries, index) => {
						try {
							const snapshotFile =
								await Internal.Sync.FileFactory.fileFromHashEntries(root, root.hashEntries[index], hashEntries, session)

							snapshotDocumentsAndFolders.push(snapshotFile)
						} catch (error) {
							// TODO: I should handle unsupported files at some point
						}
					}
				)
			)

			await new Promise(resolve => setTimeout(resolve, SNAPSHOT_DOWNLOAD_BATCH_DELAY_IN_MS))
		}

		return new Snapshot(
			root,
			snapshotDocumentsAndFolders
				.filter(file => file.constructor.name !== 'Folder')
				.map(file => new Document(file)),
			snapshotDocumentsAndFolders
				.filter(file => file.constructor.name === 'Folder')
				.map(folder => new Folder(folder))
		)
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

	/**
	 * Synchronizes the current snapshot with the
	 * latest root snapshot. If a snapshot is provided,
	 * it will be used to perform the synchronization,
	 * otherwise the synchronization will be performed
	 * against the current root hash entries from the
	 * reMarkable cloud API.
	 *
	 * @param {Session} session - The session to use for synchronization.
	 * @param {Root} [root=null] - Optional root to synchronize against.
	 * @returns {Promise<Snapshot>}
	 */
	async synchronize(session, root) {
		if(root.generation <= this.root.generation) {
			// No need to synchronize, the root is already up-to-date
			return this
		}

		// Takes new hash entries not present in the current snapshot
		// and entries present in the current snapshot but with a different checksum.
		const differentHashEntries = root.hashEntries.filter((hashEntry) => {
			const snapshotHashEntry = this.root.hashEntries.find(
				snapshotHashEntry => snapshotHashEntry.fileId === hashEntry.fileId
			)

			if(snapshotHashEntry) {
				return snapshotHashEntry.checksum !== hashEntry.checksum
			} else {
				return true
			}
		})

		const differentHashFileIds = differentHashEntries.map(hashEntry => hashEntry.fileId)

		const newDocumentsAndFolders = await differentHashEntries
			.map(async (hashEntry) =>
				await Internal.Sync.FileFactory.fileFromHashEntries(root, hashEntry, root.hashEntries, session))
		const newCachedDocuments = newDocumentsAndFolders
			.filter(file => file.constructor.name !== 'Folder')
			.map(file => new Document(file))
		const newCachedFolders = newDocumentsAndFolders
			.filter(file => file.constructor.name === 'Folder')
			.map(folder => new Folder(folder))

		return new Snapshot(
			root,
			[
				...this.documents.filter(document => differentHashFileIds.includes(document.apiDocument.rootHashEntry.fileId)),
				...newCachedDocuments
			],
			[
				...this.folders.filter(folder => differentHashFileIds.includes(folder.apiFolder.rootHashEntry.fileId)),
				...newCachedFolders
			]
		)
	}

	/**
	 * Serializes snapshot to JSON format.
	 *
	 * @returns {String}
	 */
	get toJson() {
		return JSON.stringify(
			{
				rootChecksum: this.root.checksum,
				rootGeneration: this.root.generation,
				rootHashEntriesPayload: this.root.hashEntries.payload,
				documents: this.documents.map(document => document.toJson),
				folders: this.folders.map(folder => folder.toJson)
			}
		)
	}
}
