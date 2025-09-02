import * as V4 from './v4'
import * as V3 from './v3'

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
		const hashEntriesInstances = [V4.HashEntries, V3.HashEntries].map(
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
