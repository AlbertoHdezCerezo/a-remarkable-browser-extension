import {HashEntry as V3HashEntry} from './v3/hashEntry'
import {HashEntry as V4HashEntry} from './v4/hashEntry'

export class HashEntryFactory {
	static fromPayload(payload) {
		const hashEntryInstances = [V4HashEntry, V3HashEntry].map(
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
