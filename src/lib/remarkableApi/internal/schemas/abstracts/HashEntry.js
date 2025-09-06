export class HashEntry {
	constructor() {
		if (new.target === HashEntry) {
			throw new Error('Cannot instantiate abstract class HashEntry directly')
		}
	}
}