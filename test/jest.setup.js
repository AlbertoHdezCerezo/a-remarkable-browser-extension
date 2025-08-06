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
global.pdfFileId = '00f9663d-3d4a-4640-a755-3a0e66b44f1d'
global.epubFileId = '008302bc-c5ba-41be-925b-8567166246e4'
global.folderId = '74bdc8ab-6985-419f-8416-ce93b2451e71'
global.folderRootHashEntry = '5120d65b0899e6592dcf562b7f716f32c14ed6f7b241be1944b2e06f18bf68f5:0:74bdc8ab-6985-419f-8416-ce93b2451e71:2:241'
global.pdfHashEntriesPayload = `
4
0:00f9663d-3d4a-4640-a755-3a0e66b44f1d:4:3943357
181eb8b411f5450e7bb167c1a821ca48b177101d3dc4f92b7946e7be4f306f55:0:00f9663d-3d4a-4640-a755-3a0e66b44f1d.content:0:221293
81c317035b034d9bf8b98d8071b1209388e9356bb0b5a4090c2f04fe12c790ca:0:00f9663d-3d4a-4640-a755-3a0e66b44f1d.metadata:0:417
a537198255252c5712d4d5f5c85f057ad7befe4928daf3251fa0e0bf79c04521:0:00f9663d-3d4a-4640-a755-3a0e66b44f1d.pagedata:0:481
f64d12ede9875abddb4ed7195dac67dd1a65b36cbf854c049691e7f25ba2f3cc:0:00f9663d-3d4a-4640-a755-3a0e66b44f1d.pdf:0:3721166
`.trim()
global.epubHashEntriesPayload = `
4
0:008302bc-c5ba-41be-925b-8567166246e4:5:5665759
cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531
cf0603f27e347959822926d78430c77e4264f014a9c816fe33029befb4a80f12:0:008302bc-c5ba-41be-925b-8567166246e4.epub:0:2583509
69ae298325a1a1d3f2dc4f6d6daa1db9b52ac523a1c455f19de4348184ce53e6:0:008302bc-c5ba-41be-925b-8567166246e4.metadata:0:327
63fdd266a9e733b0807f9e884e3d7c0e76cbe3100f72bef4f67865172cbbeccd:0:008302bc-c5ba-41be-925b-8567166246e4.pagedata:0:2346
322e173fac914ce59df9db85a533b6eb65d9e0e8807d07ca57f9c6e18b76af29:0:008302bc-c5ba-41be-925b-8567166246e4.pdf:0:3053046
`.trim()
global.folderHashEntriesPayload = `
4
0:74bdc8ab-6985-419f-8416-ce93b2451e71:2:241
eb7f84af0dbbe34565fc540855c36ce0727494dc1d445e52f3cc4200948a3a8b:0:74bdc8ab-6985-419f-8416-ce93b2451e71.content:0:24
c722726993535b3531211e706cde5fae35374bb6464b94279d5c5abbf3504297:0:74bdc8ab-6985-419f-8416-ce93b2451e71.metadata:0:217
`.trim()
global.pdfRootHashEntryPayload = 'e8e5d89278eebfded00982a272393d62fbd7fab1d9b4fc99b001f6ba342260c2:0:00f9663d-3d4a-4640-a755-3a0e66b44f1d:4:3943357'
global.pdfHashEntriesPayload =
	'4\n' +
	'0:13d6c4eb-3ba2-47ac-8ac2-9a4949984215:4:5191978\n' +
	'dc3d74af954a4c759609a777078d75b8cd0aa8b5b6afb4d7ade29a8960ab9eed:0:13d6c4eb-3ba2-47ac-8ac2-9a4949984215.content:0:2207\n' +
	'3d54d9a8e49c04fd4b4dd3a56ded0d616eac98f7a8a513b47e9e4f0b26da697e:0:13d6c4eb-3ba2-47ac-8ac2-9a4949984215.metadata:0:283\n' +
	'49cb2d2ab1323ea968a401fbd24a20d2b51aa1879c735f4b16f487797c9fa81f:0:13d6c4eb-3ba2-47ac-8ac2-9a4949984215.pagedata:0:24\n' +
	'65231f9f28e8cd11891c4cd3742d0c996bac70f35effedb32348d8e81fa09b45:0:13d6c4eb-3ba2-47ac-8ac2-9a4949984215.pdf:0:5189464\n'
global.epubRootHashEntryPayload = '883411c7fa93637f63ada401b9fbe06eda8d16363f946dc7f296a05c3b3ba91d:0:008302bc-c5ba-41be-925b-8567166246e4:5:5665759'
global.epubHashEntriesPayload =
	'4\n' +
	'0:008302bc-c5ba-41be-925b-8567166246e4:5:5665759\n' +
	'cd2696e19cdff3c645bf32c67bf625d9fb86208a6bd3ff33e860d76bf09a604d:0:008302bc-c5ba-41be-925b-8567166246e4.content:0:26531\n' +
	'cf0603f27e347959822926d78430c77e4264f014a9c816fe33029befb4a80f12:0:008302bc-c5ba-41be-925b-8567166246e4.epub:0:2583509\n' +
	'69ae298325a1a1d3f2dc4f6d6daa1db9b52ac523a1c455f19de4348184ce53e6:0:008302bc-c5ba-41be-925b-8567166246e4.metadata:0:327\n' +
	'63fdd266a9e733b0807f9e884e3d7c0e76cbe3100f72bef4f67865172cbbeccd:0:008302bc-c5ba-41be-925b-8567166246e4.pagedata:0:2346\n' +
	'322e173fac914ce59df9db85a533b6eb65d9e0e8807d07ca57f9c6e18b76af29:0:008302bc-c5ba-41be-925b-8567166246e4.pdf:0:3053046'