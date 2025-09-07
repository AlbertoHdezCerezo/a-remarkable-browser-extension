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
import * as Sync from '../src/lib/remarkableApi/internal/sync'
import * as Schemas from '../src/lib/remarkableApi/internal/schemas'
import {Device} from '../src/lib/remarkableApi/internal/token/device.js'
import {Session} from '../src/lib/remarkableApi/internal/token/session.js'

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
 * Sample payloads to be reused across methods
 */
global.rootHashChecksum = 'f1c4e71ee19b26fda596b84e929e936c77aef64644a68253854b4db795b48b1e'
global.rootMetadata = {
	hash: global.rootHashChecksum,
	generation: 1756597331766283,
	schemaVersion: 4
}
global.rootHashEntriesPayload = `
4
0:.:10:65001440
e8e5d89278eebfded00982a272393d62fbd7fab1d9b4fc99b001f6ba342260c2:0:00a69f8e-8a4f-431b-b8d0-635114f7e958:4:40152142
394f0fa23d762f99435888e20690c5d43b9d6d4f3e82ebc67d7a6706c1c58162:0:05d47ac3-2f8d-4a16-a382-c14607305169:5:24849137
e6ac06a8696c36bb446962ec39df689dfa3765d81cd701f30e133df927df67d3:0:03d93d9b-b6f3-4503-9993-26faf23c22e1:1:161
`
global.root = new Sync.V3.Root(
	global.rootMetadata.hash,
	global.rootMetadata.generation,
	Schemas.HashEntriesFactory.fromPayload(global.rootHashEntriesPayload)
)
global.pdfRootHashEntryPayload = 'e8e5d89278eebfded00982a272393d62fbd7fab1d9b4fc99b001f6ba342260c2:0:00a69f8e-8a4f-431b-b8d0-635114f7e958:4:40152142'
global.pdfFileChecksum = 'e8e5d89278eebfded00982a272393d62fbd7fab1d9b4fc99b001f6ba342260c2'
global.pdfHashEntriesPayload = `
4
0:00a69f8e-8a4f-431b-b8d0-635114f7e958:4:40152142
28c5b06d4fc59837fa3c28edd3e6ac872c026859e29445aeede5554abb742584:0:00a69f8e-8a4f-431b-b8d0-635114f7e958.content:0:10518
c67b27de419b0aba24ea786e60295f2f59d1c8ea3a6a61d174675fa3bab36270:0:00a69f8e-8a4f-431b-b8d0-635114f7e958.metadata:0:360
aa05f6f0a0f26de05beebb18c0484f945bbc421c64ec32f4f1e80becb090a0a5:0:00a69f8e-8a4f-431b-b8d0-635114f7e958.pagedata:0:161
c98ae15cfe5e0e99d477bc89cbd8d7d3df89fa4422aecbfd6278f054e2f9425d:0:00a69f8e-8a4f-431b-b8d0-635114f7e958.pdf:0:40141103
`
global.pdfMetadataChecksum = 'c67b27de419b0aba24ea786e60295f2f59d1c8ea3a6a61d174675fa3bab36270'
global.pdfMetadata = {
	createdTime: "1755458613054",
	lastModified: "1755458613054",
	lastOpened: "0",
	lastOpenedPage: 0,
	new: false,
	parent: "a80ce266-2974-491c-86b6-670453fd0b51",
	pinned: false,
	source: "",
	type: "DocumentType",
	visibleName: "PDF Document.pdf"
}
global.pdfFile = new Sync.V3.Document(
	global.root.hashEntries.hashEntriesList[0],
	Schemas.HashEntriesFactory.fromPayload(global.pdfHashEntriesPayload),
	new Sync.V3.DocumentMetadata(
		global.root.hashEntries.hashEntriesList[0],
		global.pdfMetadata
	)
)
global.ePubRootHashEntryPayload = '394f0fa23d762f99435888e20690c5d43b9d6d4f3e82ebc67d7a6706c1c58162:0:05d47ac3-2f8d-4a16-a382-c14607305169:5:24849137'
global.ePubFileChecksum = '394f0fa23d762f99435888e20690c5d43b9d6d4f3e82ebc67d7a6706c1c58162'
global.ePubHashEntriesPayload = `
4
0:05d47ac3-2f8d-4a16-a382-c14607305169:5:24849137
db023e4a0be5ac43f8ea09e889e02f01e224366a8caa9817ded34eb9a4c0e508:0:05d47ac3-2f8d-4a16-a382-c14607305169.content:0:38228
19969af609615dd9499abdd46814f58bcde2625abe916d916bf0fe883544c8e8:0:05d47ac3-2f8d-4a16-a382-c14607305169.epub:0:12637685
5284b61dcad70c54c379cada178e00d62875580a0390324c94177202f821a6f3:0:05d47ac3-2f8d-4a16-a382-c14607305169.metadata:0:324
bebfcdada9fd800bf50c40df77da78b2ea947c38845ab970be330afe43422572:0:05d47ac3-2f8d-4a16-a382-c14607305169.pagedata:0:3672
50fbfb40af491c9479b663cc8e79d387e1582df77b80b27b230095475372558d:0:05d47ac3-2f8d-4a16-a382-c14607305169.pdf:0:12169228
`
global.ePubMetadataChecksum = '5284b61dcad70c54c379cada178e00d62875580a0390324c94177202f821a6f3'
global.ePubMetadata = {
	"createdTime": "1755461048428",
	"lastModified": "1755931610113",
	"lastOpened": "0",
	"lastOpenedPage": 0,
	"new": false,
	"parent": "8d7b715b-b55e-4db0-95d2-876e5d6feef1",
	"pinned": false,
	"source": "",
	"type": "DocumentType",
	"visibleName": "ePub Document.epub"
}
global.ePubFile = new Sync.V3.Document(
	global.root.hashEntries.hashEntriesList[1],
	Schemas.HashEntriesFactory.fromPayload(global.ePubHashEntriesPayload),
	new Sync.V3.DocumentMetadata(
		global.root.hashEntries.hashEntriesList[1],
		global.ePubMetadata
	)
)
global.folderRootHashEntryPayload = 'e6ac06a8696c36bb446962ec39df689dfa3765d81cd701f30e133df927df67d3:0:03d93d9b-b6f3-4503-9993-26faf23c22e1:1:161'
global.folderFileChecksum = 'e6ac06a8696c36bb446962ec39df689dfa3765d81cd701f30e133df927df67d3'
global.folderHashEntriesPayload = `
4
0:03d93d9b-b6f3-4503-9993-26faf23c22e1:1:161
caaf86ab3ed7ee7c28eba326f6c351393b300fe6f954db37a3401b0ebd1faa52:0:03d93d9b-b6f3-4503-9993-26faf23c22e1.metadata:0:161
`
global.folderMetadataChecksum = 'caaf86ab3ed7ee7c28eba326f6c351393b300fe6f954db37a3401b0ebd1faa52'
global.folderMetadata = {
	"createdTime":1754766116482,
	"lastModified":1754766116482,
	"visibleName":"Test Folder",
	"type":"CollectionType",
	"source":"",
	"new":false,
	"pinned":false,
	"parent":""
}
global.folder = new Sync.V3.Folder(
	global.root.hashEntries.hashEntriesList[2],
	Schemas.HashEntriesFactory.fromPayload(global.folderHashEntriesPayload),
	new Sync.V3.FolderMetadata(
		global.root.hashEntries.hashEntriesList[2],
		global.folderMetadata
	)
)