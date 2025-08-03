import {HashEntries as V4HashEntries} from './v4/hashEntries'
import {HashEntries as V3HashEntries} from './v3/hashEntries'

export class UnsupportedHashEntriesPayloadError extends Error {
	constructor(
		originalError,
		message = `
			The provided hash entries payload is not supported.
			Original error: ${originalError.message}
		`
	) {
		super(message);
		this.name = 'UnsupportedHashEntriesPayloadError'
	}
}

export class HashEntriesFactory {
	static fromPayload(payload) {
		const hashEntriesInstances = [V4HashEntries, V3HashEntries].map(
			hashEntriesClass => {
				try {
					return new hashEntriesClass(payload)
				} catch(error) {
					return error
				}
			})

		const hashEntriesInstance = hashEntriesInstances.find(instance => !(instance instanceof Error))

		if(hashEntriesInstance) return hashEntriesInstance

		throw new UnsupportedHashEntriesPayloadError(hashEntriesInstances[0])
	}
}
