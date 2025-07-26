/**
 * Script to set up test environment
 * before test suite run starts.
 */

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
 * Global credentials
 */
global.remarkableDeviceConnectionToken = process.env.REMARKABLE_DEVICE_CONNECTION_TOKEN
global.remarkableSessionToken = process.env.REMARKABLE_SESSION_TOKEN

/**
 * Global sample data
 */
global.pdfRootHashEntryPayload = 'e8e5d89278eebfded00982a272393d62fbd7fab1d9b4fc99b001f6ba342260c2:0:00f9663d-3d4a-4640-a755-3a0e66b44f1d:4:3943357'
global.pdfHashEntriesPayload =
	'4\n' +
	'0:0bacf12a-64fa-4fe5-9f28-16a043e8c809:4:56764166\n' +
	'5235230355244886be4934029dbf69ca85808f4ca8af9e8530cd84daa278cada:0:0bacf12a-64fa-4fe5-9f28-16a043e8c809.content:0:17092\n' +
	'd451044d7cd77de7ab6a6949957d0b8074fe55d6563fef1b40b392c99e74b5c9:0:0bacf12a-64fa-4fe5-9f28-16a043e8c809.metadata:0:314\n' +
	'a636b87529d384070cdf9c75cf35aaabc66e027bae9bf0c7f99e83f6298546bd:0:0bacf12a-64fa-4fe5-9f28-16a043e8c809.pagedata:0:1428\n' +
	'531b4f8a46c610f14e4295105c416db6e4b47d4475c70ed516f8adfc7ea46e1d:0:0bacf12a-64fa-4fe5-9f28-16a043e8c809.pdf:0:56745332'
global.epubRootHashEntryPayload = '883411c7fa93637f63ada401b9fbe06eda8d16363f946dc7f296a05c3b3ba91d:0:008302bc-c5ba-41be-925b-8567166246e4:5:5665759'
global.epubHashEntriesPayload =
	'4\n' +
	'0:008302bc-c5ba-41be-925b-8567166246e4:5:5665759\n' +
	'cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531\n' +
	'cf0603f27e347959822926d78430c77e4264f014a9c816fe33029befb4a80f12:0:008302bc-c5ba-41be-925b-8567166246e4.epub:0:2583509\n' +
	'69ae298325a1a1d3f2dc4f6d6daa1db9b52ac523a1c455f19de4348184ce53e6:0:008302bc-c5ba-41be-925b-8567166246e4.metadata:0:327\n' +
	'63fdd266a9e733b0807f9e884e3d7c0e76cbe3100f72bef4f67865172cbbeccd:0:008302bc-c5ba-41be-925b-8567166246e4.pagedata:0:2346\n' +
	'322e173fac914ce59df9db85a533b6eb65d9e0e8807d07ca57f9c6e18b76af29:0:008302bc-c5ba-41be-925b-8567166246e4.pdf:0:3053046'