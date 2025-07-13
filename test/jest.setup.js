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
import NodeHttpAdapter from '@pollyjs/adapter-node-http'

Polly.register(NodeHttpAdapter)
Polly.register(FSPersister)
