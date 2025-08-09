export class HashEntries {
	constructor() {
		if (new.target === HashEntries) {
			throw new Error('Cannot instantiate abstract class HashEntries directly')
		}
	}
}