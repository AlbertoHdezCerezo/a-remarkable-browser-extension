#! /usr/bin/env node

import fs from 'fs'
import shell from 'shelljs'
import {program} from 'commander'
import {spinner, intro, outro, text, confirm, cancel, select, tasks, log} from '@clack/prompts'

import dotenv from 'dotenv'

dotenv.config({ path: '.env.test' })

import Device from './src/lib/remarkableApi/internal/token/device'
import Session from './src/lib/remarkableApi/internal/token/session'
import Snapshot from './src/lib/remarkableApi/cache/snapshot'

program
	.name('a-remarkable-api-debug-cli')
	.description('A CLI tool for debugging the reMarkable API')
	.version('0.1.0')

program.parse()

intro(`a reMarkable API debug CLI`)

let loop = true
let device = new Device(process.env.REMARKABLE_DEVICE_TOKEN)
let session = new Session(process.env.REMARKABLE_SESSION_TOKEN)
let snapshot = null

/**
 * Tasks
 */
async function refreshSession() {
	await tasks([
		{
			title: 'Loading new session from device ...',
			task: async (message) => {
				session = await Session.from(device)
				return `Session loaded with token: ${session.token.substring(0, 15)} ...`
			}
		}
	])
}

async function refreshSnapshot() {
	await tasks([
		{
			title: 'Loading new session from device ...',
			task: async (message) => {
				snapshot = await Snapshot.fromSession(session)
				return `Snapshot loaded: ${snapshot.documents.length} documents and ${snapshot.folders.length} folders found.`
			}
		}
	])
}

/**
 * Main Loop
 */
while (loop) {
	const option = await select({
		message: 'What do you want to do?',
		options: [
			{ value: 'file-manager', label: 'Navigate through reMarkable File System' },
			{ value: 'exit', label: 'Exit CLI tool' }
		],
	})

	switch (option) {
		case 'file-manager':
			await refreshSession()
			await refreshSnapshot()
			break
		case 'exit':
			loop = false
			break
		default:
			loop = false
			break
	}
}

outro('Goodbye!')