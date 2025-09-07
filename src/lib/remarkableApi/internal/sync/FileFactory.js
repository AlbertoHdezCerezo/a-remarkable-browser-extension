import * as V3 from './v3'

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
	/**
	 * Given a set of hash entries belonging to a
	 * reMarkable API file, returns the equivalent
	 * model class instance representing the file.
	 *
	 * @param {V3HashEntries | V4HashEntries} hashEntries
	 * @returns {File}
	 */
	static async fileFromHashEntries(root, rootFileHashEntry, hashEntries, session) {
		const fileClassCandidate = [V3.Document, V3.Folder].find(fileClass => fileClass.compatibleWithHashEntries(hashEntries))

		if(!fileClassCandidate) throw new UnsupportedHashFileHashEntriesPayloadError()

		return await fileClassCandidate.fromHashEntries(root, rootFileHashEntry, hashEntries, session)
	}
}