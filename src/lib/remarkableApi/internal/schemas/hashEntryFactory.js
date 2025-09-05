import * as V3 from './v3'
import * as V4 from './v4'

export class HashEntryFactory {
	static fromPayload(payload) {
		const hashEntryInstances = [V4.HashEntry, V3.HashEntry].map(
			hashEntriesClass => {
				try {
					return new hashEntriesClass(payload)
				} catch(error) {
					return error
				}
			})

		const hashEntryInstance = hashEntryInstances.find(instance => !(instance instanceof Error))

		if(hashEntryInstance) return hashEntryInstance

		throw hashEntryInstances[0]
	}
}
