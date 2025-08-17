import { jest } from '@jest/globals'

/**
 * Script to set up test environment
 * before test suite run starts.
 */

/**
 * Set-Up logic: designed to easily set development
 * environment variables and run test suite
 * to regenerate text fixtures.
 */
import {spinner, intro, outro, text, confirm, cancel, select, tasks, log} from '@clack/prompts'

/**
 * Due to Polly.js deprecations, we use NodeHTTPAdapter instead of FetchAdapter.
 * When @pollyjs/adapter-fetch is running in a Node.js environment, it uses a polyfill
 * for fetch, which is not as reliable or feature-complete as the native fetch API in
 * the browser. That's why the package maintainers have deprecated its use in Node.js
 * and recommend using the @pollyjs/adapter-node-http package instead.
 */
import { Polly } from '@pollyjs/core'
import FSPersister from '@pollyjs/persister-fs'
import FetchAdapter from '@pollyjs/adapter-fetch'
import NodeHttpAdapter from '@pollyjs/adapter-node-http'

Polly.register(NodeHttpAdapter)
Polly.register(FetchAdapter)
Polly.register(FSPersister)

/**
 * Load environment variables from .env.test file
 */
import dotenv from 'dotenv'

dotenv.config({ path: '.env.test' })

/**
 * This tests perform a lot of HTTP operations, and many
 * of them use delays in between calls to avoid hitting
 * API rate limits. Therefore, we increase the Jest timeout
 * to 100 seconds.
 */

import fs from 'fs'
import Device from '../src/lib/remarkableApi/internal/token/device'
import Session from '../src/lib/remarkableApi/internal/token/session'
import Root from '../src/lib/remarkableApi/internal/sync/root'
import Upload from '../src/lib/remarkableApi/internal/doc/v2/upload'
import Folder from '../src/lib/remarkableApi/internal/sync/v3/files/folder/folder'
import FileBuffer from '../src/lib/remarkableApi/utils/fileBuffer'

/**
 * Global credentials
 */
global.remarkableDeviceToken = process.env.REMARKABLE_DEVICE_TOKEN
global.remarkableSessionToken = process.env.REMARKABLE_SESSION_TOKEN

/**
 * Checks if remarkable device token environment variable
 * exists. If not present throws error. Otherwise, creates
 * a new Device instance which will be used to perform
 * authenticated requests to the reMarkable API.
 */
if (!global.remarkableDeviceToken) throw new Error('REMARKABLE_DEVICE_TOKEN environment variable is not set')
global.remarkableDevice = new Device(global.remarkableDeviceToken)

/**
 * Checks if remarkable session token environment variable
 * exists. If not present, creates a new session using
 * the Device instance created above. The session token
 * is then stored in the global scope and also appended
 * to the .env.test file for future use.
 */
if (!global.remarkableSessionToken) {
	const newSession = await Session.from(global.remarkableDevice)
	fs.appendFileSync('.env.test', `\nREMARKABLE_SESSION_TOKEN=${newSession.token}\n`)
	global.remarkableSessionToken = newSession.token
	global.remarkableApiSession = newSession
} else {
	global.remarkableApiSession = new Session(global.remarkableSessionToken)
}

/**
 * Creates a set of sample files which will be used
 * across test suite to handle safely account documents
 * only uploaded for testing purposes.
 */
global.samplePdfHashEntryPayload = process.env.SAMPLE_PDF_FILE_HASH_ENTRY_PAYLOAD
global.sampleEpubHashEntryPayload = process.env.SAMPLE_EPUB_FILE_HASH_ENTRY_PAYLOAD
global.sampleFolderHashEntryPayload = process.env.SAMPLE_FOLDER_FILE_HASH_ENTRY_PAYLOAD

if (!global.samplePdfHashEntryPayload) {
	const pdfFileBuffer = new FileBuffer(fs.readFileSync('./test/fixtures/documents/sample.pdf'))
	const pdfFile = await Upload.upload('a-remarkable-web-browser-pdf-file.pdf', pdfFileBuffer, global.remarkableApiSession)
	fs.appendFileSync('.env.test', `\nSAMPLE_PDF_FILE_HASH_ENTRY_PAYLOAD=${pdfFile.rootHashEntry.payload}\n`)
	global.samplePdfHashEntryPayload = pdfFile.rootHashEntry.payload
}

if (!global.sampleEpubHashEntryPayload) {
	const epubFileBuffer = new FileBuffer(fs.readFileSync('./test/fixtures/documents/sample.epub'))
	const epubFile = await Upload.upload('a-remarkable-web-browser-epub-file.epub', epubFileBuffer, global.remarkableApiSession)
	fs.appendFileSync('.env.test', `\nSAMPLE_EPUB_FILE_HASH_ENTRY_PAYLOAD=${epubFile.rootHashEntry.payload}\n`)
	global.sampleEpubHashEntryPayload = epubFile.rootHashEntry.payload
}

if (!global.sampleFolderHashEntryPayload) {
	const root = await Root.fromSession(global.remarkableApiSession)
	const folder = await Folder.create(root, 'a-remarkable-web-browser-folder', global.remarkableApiSession)
	fs.appendFileSync('.env.test', `\nSAMPLE_FOLDER_FILE_HASH_ENTRY_PAYLOAD=${folder.rootHashEntry.payload}\n`)
	global.sampleFolderHashEntryPayload = folder.rootHashEntry.payload
}
