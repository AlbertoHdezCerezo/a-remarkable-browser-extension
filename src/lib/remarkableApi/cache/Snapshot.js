import * as Sync from '../internal/sync'

/**
 * A Snapshot holds the entire state of a reMarkable device
 * at a certain point in time. This state is represented
 * by all documents and folders in the system, plus the
 * current root representation (hash entries, checksum
 * and generation).
 *
 *
 * Snapshots can be serialized and deserialized, allowing
 * the system to keep a cached version of the file system
 * in persistent storage, to restore at any point in time
 * without performing too many IO operations against the
 * remarkable cloud API.
 *
 * It also provides additional methods to easily synchronize
 * the data hold with the latest changes in the account.
 */
export class Snapshot {
	/**
	 * reMarkable root instance at the time the
	 * snapshot was taken.
	 *
	 * @type {Root}
	 */
	#root

	/**
	 * All documents present in the system
	 * at the time the snapshot was taken.
	 *
	 * @type {Array<Document>}
	 */
	#documents

	/**
	 * All folders present in the system
	 * at the time the snapshot was taken.
	 *
	 * @type {Array<Folder>}
	 */
	#folders

	/**
	 * Creates a new Snapshot instance from
	 * a reMarkable session.
	 *
	 * This operation will perform a significant amount of
	 * API requests to the reMarkable cloud API, proportional
	 * to the number of documents and folders present in the
	 * account at the time of execution.
	 *
	 * @param {Session} session - reMarkable session to create the snapshot from.
	 * @returns {Snapshot}
	 */
	static async fromSession(session) {
		const root = await Sync.V3.Root.fromSession(session)

		const documents = []
		const folders = []

		await Promise.all(
			root.hashEntries.hashEntriesList.map(async hashEntriesHashEntry => {
				const file = await Sync.V3.FileFactory.fileFromHashEntry(hashEntriesHashEntry, session)
				if (file.constructor === Sync.V3.Document) documents.push(file)
				if (file.constructor === Sync.V3.Folder) folders.push(file)
			})
		)

		return new Snapshot(root, documents, folders)
	}

	constructor(root, documents, folders) {
		this.#root = root
		this.#documents = documents
		this.#folders = folders
	}

	/**
	 * Returns the root instance of the snapshot.
	 *
	 * @returns {Root}
	 */
	get root() {
		return this.#root
	}

	/**
	 * Returns all documents present in the snapshot.
	 *
	 * @returns {Array<Document>}
	 */
	get documents() {
		return this.#documents
	}

	/**
	 * Returns all folders present in the snapshot.
	 *
	 * @returns {Array<Folder>}
	 */
	get folders() {
		return this.#folders
	}

	/**
	 * Aligns Snapshot root version, documents and folders
	 * with the latest state in the reMarkable account.
	 *
	 * @param {Session} session - reMarkable session to synchronize the snapshot with.
	 * @returns {Promise<Snapshot>}
	 */
	async synchronize(session) {
		const updatedRoot = await Sync.V3.Root.fromSession(session)

		if (updatedRoot.generation === this.root.generation) return this

		const filesToUpsert = []
		const fileIdsToDelete = []

		const previousExistingFileIds = this.root.hashEntries.hashEntriesList.map(hashEntry => hashEntry.fileId)

		await Promise.all(
			[...this.documents, ...this.folders].map(async file => {
				const updatedRootFileHashEntry =
					updatedRoot.hashEntries.hashEntriesList.find(hashEntry => hashEntry.fileId === file.rootHashEntry.fileId)

				if (updatedRootFileHashEntry === undefined) {
					fileIdsToDelete.push(file.rootHashEntry.fileId)
				} else {
					if (file.rootHashEntry.checksum !== updatedRootFileHashEntry.checksum) {
						const newFile = await Sync.V3.FileFactory.fileFromHashEntry(updatedRootFileHashEntry, session)
						filesToUpsert.push(newFile)
						fileIdsToDelete.push(updatedRootFileHashEntry.fileId)
					}
				}
			})
		)

		await Promise.all(
			updatedRoot.hashEntries.hashEntriesList.map(async fileRootHashEntry => {
				if (!previousExistingFileIds.includes(fileRootHashEntry.fileId)) {
					const newFile = await Sync.V3.FileFactory.fileFromHashEntry(fileRootHashEntry, session)
					filesToUpsert.push(newFile)
				}
			})
		)

		this.#documents = this.documents
			.filter(document => !fileIdsToDelete.includes(document.rootHashEntry.fileId))
		this.#folders = this.folders
			.filter(folder => !fileIdsToDelete.includes(folder.rootHashEntry.fileId))

		this.#documents = this.documents.concat(filesToUpsert.filter(file => file.constructor === Sync.V3.Document))
		this.#folders = this.folders.concat(filesToUpsert.filter(file => file.constructor === Sync.V3.Folder))
		this.#root = updatedRoot

		return this
	}

	/**
	 * Returns a serialized version of the Snapshot instance.
	 * This serialized version is a JSON string containing
	 * all the information needed to reconstruct the Snapshot instance.
	 *
	 * @returns {String}
	 */
	serialize() {
		return JSON.stringify(
			{
				root: this.root.serialize(),
				documents: this.documents.map(document => document.serialize()),
				folders: this.folders.map(folder => folder.serialize())
			}
		)
	}

	/**
	 * Given a serialized snapshot, returns an instance of the Snapshot class.
	 *
	 * @param {String} serializedSnapshot - The serialized snapshot.
	 * @returns {Snapshot}
	 */
	static deserialize(serializedSnapshot) {
		const parsedSnapshot = JSON.parse(serializedSnapshot)

		const deserializedDocuments = []
		for (const documentPayload of parsedSnapshot.documents) {
			const deserializedDocument = Sync.V3.Document.deserialize(documentPayload)
			deserializedDocuments.push(deserializedDocument)
		}

		const deserializedFolders = []
		for (const folderPayload of parsedSnapshot.folders) {
			const deserializedFolder = Sync.V3.Folder.deserialize(folderPayload)
			deserializedFolders.push(deserializedFolder)
		}

		return new Snapshot(
			Sync.V3.Root.deserialize(parsedSnapshot.root),
			deserializedDocuments,
			deserializedFolders
		)
	}
}