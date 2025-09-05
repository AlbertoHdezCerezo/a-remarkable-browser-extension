import { Polly } from '@pollyjs/core'

const IN_BETWEEN_RECORDED_SPECS_WAIT_TIME_IN_MS = 5000
const DEFAULT_RECORDS_DIR = './test/fixtures/http-records'
const DEFAULT_POLLY_CONFIGURATION = {
  recordIfMissing: true,
  recordFailedRequests: true,
  adapters: ['node-http', 'fetch'],
  persister: 'fs',
  // logLevel: 'debug'
}

/**
 * Starts a new HTTP recording session using Polly.js.
 *
 * @returns {Polly}
 */
export async function startHttpRecording () {
  const recordName = `${DEFAULT_RECORDS_DIR}/${expect.getState().currentTestName}`

  let polly = new Polly('recordings', {
    ...DEFAULT_POLLY_CONFIGURATION,
    persisterOptions: { fs: { recordingsDir: recordName } }
  })

  polly.server.any().on('beforePersist', async (_req, _recording) => {
    // This ensures after each recorded request there is a delay
    // to avoid hitting API rate limits. This is only applied on
    // the first recordings.
    // await new Promise(resolve => setTimeout(resolve, IN_BETWEEN_RECORDED_SPECS_WAIT_TIME_IN_MS))
  })

  return polly
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

  beforeEach(async () => { polly = await startHttpRecording() })

  afterEach(async () => {
    await stopHttpRecording(polly)
  })
}
