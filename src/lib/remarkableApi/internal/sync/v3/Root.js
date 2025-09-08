import {CONFIGURATION} from '../../../configuration.js'
import {FetchBasedHttpClient} from '../../../../utils/httpClient/index.js'
import {HashEntriesFactory} from '../../schemas/index.js'
import * as Schemas from '../../schemas'

export class UnreachableRootError extends Error {
	constructor(
		originalError,
		message = `
			Attempt to fetch root metadata from reMarkable cloud API failed.
			Original error message: ${originalError.message}
		`
	) {
		super(message)
		this.name = 'UnreachableRootError'
		this.stack = `${this.stack}\nCaused by: ${originalError.stack}`
	}
}

export class UnreachableRootHashEntriesError extends Error {
	constructor(
		originalError,
		message = `
			Attempt to fetch root hash entries from reMarkable cloud API failed.
			Original error message: ${originalError.message}
		`
	) {
		super(message)
		this.name = 'UnreachableRootHashEntriesError'
		this.stack = `${this.stack}\nCaused by: ${originalError.stack}`
	}
}

/**
 * Represents a snapshot of the reMarkable cloud
 * file system at a specific point in time.
 *
 * The root is represented in the reMarkable API
 * by the hash entries of all he files under the
 * reMarkable cloud account, plus a generation
 * number, which is a timestamp of the time the
 * root was generated; and a checksum of those
 * hash entries.
 *
 * Example:
 *
 * ```
 * // Root payload
 * {
 *     "hash": "643873ffd597dbee9f831f2242c688ceb214070b529bfa11d5f5d5df76a373e4",
 *     "generation": 1754308915906678,
 *     "schemaVersion": 4
 * }
 *
 * // Root hash entries payload
 * 4
 * 0:.:396:15969564151
 * 883411c7fa93637f63ada401b9fbe06eda8d16363f946dc7f296a05c3b3ba91d:0:008302bc-c5ba-41be-925b-8567166246e4:5:5665759
 * e8e5d89278eebfded00982a272393d62fbd7fab1d9b4fc99b001f6ba342260c2:0:00f9663d-3d4a-4640-a755-3a0e66b44f1d:4:3943357
 * 5ade6b3c89f1483a3e770d0392e86e3593307e6d53b1e1f48cb66f9a116bdad2:0:04374835-5769-40a9-897e-88050f8f3501:4:107426982
 * 2c9a9e10984e55e0ba7206a189dba6f007dcd46122b92720d916ca551ee96ca9:0:05ad2707-750f-4a8c-9513-66aa2917a906:4:3684358
 * a9cae2ec2359d092036248084c400fe3fcf73b06ecd080739db2434fa79447af:0:05d8aaa7-641a-4bd4-a21e-c359d8129ab6:4:57221792
 * 7a6c64d0d2a619eaab290e1a0d179af6ba11e2b5b4ae64c24c834d4af6d1a930:0:0608d996-dd20-4d19-970d-bc803fd91b78:4:17780398
 * 8c38ec63e8d01a9f0c5bf1378b3e1cc1334aaebb01d683893b143b7620045d0b:0:06ff5be0-30ae-4de0-a786-3b508b3317a2:3:10064
 * a8b9f03ade41a6072192b3fa4b75757bb783ec6d676793948ae92cf970928259:0:077f5348-3bf1-4fc3-8ae6-30ce1c64470c:4:90991742
 * 8971267e2e8a05028af610ae6aa2c90b9dbb56333fb003b44704f32a3c70662d:0:080b7b49-b72f-49b3-9399-078767c63ee8:7:4268098
 * 8eef313b2d7a9164b4e38dc05d4b44e9e74fb78371e58dbf02163805554b8fcd:0:0a95b73e-81f7-42af-8542-bd4e777f54e1:3:2885
 * ...
 * ```
 *
 * Each operation that modifies a file in the reMarkable cloud
 * triggers the generation of a new root hash, containing a
 * new hash entry for the modified file, and a new generation number.
 */
export class Root {
	/**
	 * Returns the current root of the reMarkable cloud account
	 *
	 * @param {Session} session - The session used to authenticate the request.
	 * @returns {Promise<Root>}
	 */
	static async fromSession(session) {
		let rootResponse = null

		try {
			rootResponse = await FetchBasedHttpClient.get(
				CONFIGURATION.endpoints.sync.v3.endpoints.root,
				{'Authorization': `Bearer ${session.token}`}
			)
		} catch (error) {
			throw new UnreachableRootError(error)
		}

		const rootPayload = await rootResponse.json()
		const rootChecksum = rootPayload.hash
		const rootGeneration = Number(rootPayload.generation)

		let rootHashResponse = null

		try {
			rootHashResponse = await FetchBasedHttpClient.get(
				CONFIGURATION.endpoints.sync.v3.endpoints.files + rootChecksum,
				{'Authorization': `Bearer ${session.token}`}
			)
		} catch (error) {
			throw new UnreachableRootHashEntriesError(error)
		}

		const rootHashPayload = await rootHashResponse.text()

		return new Root(rootChecksum, rootGeneration, HashEntriesFactory.fromPayload(rootHashPayload.trim()))
	}

	/**
	 * reMarkable root hash entries checksum.
	 *
	 * @typedef {string}
	 */
	#checksum

	/**
	 * reMarkable root generation number.
	 * Timestamp of the time the current root was generated.
	 *
	 * @typedef {number}
	 */
	#generation

	/**
	 * Root hash entries. Each entry represents a file in
	 * the reMarkable cloud account, and each file present
	 * in the reMarkable cloud account has a unique entry
	 * in this list.
	 *
	 * @type {HashEntries}
	 */
	#hashEntries

	constructor(checksum, generation, hashEntries) {
		this.#checksum = checksum
		this.#generation = generation
		this.#hashEntries = hashEntries
	}

	/**
	 * Returns the root hash entries checksum.
	 *
	 * @returns {string}
	 */
	get checksum() {
		return this.#checksum
	}

	/**
	 * Returns the root generation number.
	 * It is the timestamp of the time the
	 * current root was generated.
	 *
	 * @returns {number}
	 */
	get generation() {
		return this.#generation
	}

	/**
	 * Returns the root hash entries.
	 * Each entry represents a file in the reMarkable
	 * cloud account. All files present in the reMarkable
	 * cloud account have a unique entry in this list.
	 *
	 * @returns {HashEntries}
	 */
	get hashEntries() {
		return this.#hashEntries
	}

	/**
	 * Given a serialized root, returns an instance of the Root class.
	 *
	 * @param {String} stringifiedRoot - The serialized root.
	 * @returns {Root}
	 */
	static deserialize(stringifiedRoot) {
		const parsedRoot = JSON.parse(stringifiedRoot)

		const hashEntries = Schemas.HashEntriesFactory.fromPayload(parsedRoot.hashEntries)
		const generation = Number(parsedRoot.generation)
		const checksum = parsedRoot.checksum

		return new this(checksum, generation, hashEntries)
	}

	/**
	 * Returns a serialized version of the Root instance.
	 * This serialized version is a JSON string containing
	 * all the information needed to reconstruct the Root instance.
	 *
	 * @returns {String}
	 */
	serialize() {
		return JSON.stringify(
			{
				checksum: this.checksum,
				generation: this.generation,
				hashEntries: this.hashEntries.payload,
			}
		)
	}
}
