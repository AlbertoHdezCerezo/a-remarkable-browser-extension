import { Polly } from '@pollyjs/core'

const DEFAULT_RECORDS_DIR = './test/fixtures/http-records'
const DEFAULT_POLLY_CONFIGURATION = {
	recordFailedRequests: true,
	adapters: ['node-http'],
	persister: 'fs',
	logLevel: 'info'
}

/**
 * Starts a new HTTP recording session using Polly.js.
 *
 * @returns {Polly}
 */
export function startHttpRecording () {
	const recordName = `${DEFAULT_RECORDS_DIR}/${expect.getState().currentTestName}`

	return new Polly('recordings', {
		...DEFAULT_POLLY_CONFIGURATION,
		persisterOptions: { fs: { recordingsDir: recordName } }
	})
}

/**
 * Stops the current HTTP recording session.
 *
 * @param {Polly} polly - The Polly instance to stop.
 * @returns {Promise<void>}
 */
export async function stopHttpRecording (polly) {
	return polly.stop()
}

/**
 * Sets up Polly.js based HTTP recording for tests.
 */
export function setupHttpRecording () {
	let polly

	beforeEach(() => { polly = startHttpRecording() })
	afterEach(async () => { await stopHttpRecording(polly) })
}