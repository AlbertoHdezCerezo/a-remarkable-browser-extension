import * as V3 from './index.js'
import * as Schemas from '../../schemas'

export class UnsupportedHashFileHashEntriesPayloadError extends Error {
	constructor(
		message = `
			The provided hash entries payload does not match
			with any of the known file hash entries formats.
		`
	) {
		super(message)
		this.name = 'UnsupportedHashFileHashEntriesPayloadError'
	}
}

/**
 * Factory class to instantiate reMarkable
 * API models from a given set of hash
 * entries representing the entities.
 *
 * Each file within the reMarkable API
 * is represented by a set of hash entries
 * that define the content of the file.
 *
 * The format of these hash entries can vary,
 * depending on the type of file and its
 * schema version. Hence, this factory class,
 * to encapsulate the logic for inferring the
 * correct model based on the hash entries.
 */
export class FileFactory {
	static async fileFromHashEntry(rootFileHashEntry, session) {
		const fileHashEntriesPayload = await rootFileHashEntry.content(session)
		const fileHashEntries = Schemas.HashEntriesFactory.fromPayload(fileHashEntriesPayload)

		return this.fileFromHashEntries(rootFileHashEntry, fileHashEntries, session)
	}

	/**
	 * Given a set of hash entries belonging to a
	 * reMarkable API file, returns the equivalent
	 * model class instance representing the file.
	 *
	 * @param {HashEntry} rootFileHashEntry - The root hash entry of the file
	 * @param {HashEntries} hashEntries - The hash entries representing the file content
	 * @param {Session} session - The session used to authenticate requests
	 * @returns {File}
	 */
	static async fileFromHashEntries(rootFileHashEntry, hashEntries, session) {
		const fileClassCandidate = this.compatibleFileConstructorForHashEntries(hashEntries)

		if(!fileClassCandidate) throw new UnsupportedHashFileHashEntriesPayloadError()

		return fileClassCandidate.fromHashEntries(rootFileHashEntry, hashEntries, session)
	}

	/**
	 * Returns the class constructor of the file model
	 * compatible with the provided hash entries.
	 *
	 * @param {HashEntries} hashEntries - The hash entries representing the file content
	 * @returns {Document | Folder} - The class constructor
	 */
	static compatibleFileConstructorForHashEntries(hashEntries) {
		return [V3.Document, V3.Folder]
			.find(fileClass => fileClass.compatibleWithHashEntries(hashEntries))
	}
}