#! /usr/bin/env node

import fs from 'fs'
import shell from 'shelljs'
import {program} from 'commander'
import {spinner, intro, outro, text, confirm, cancel, select, tasks, log} from '@clack/prompts'

import dotenv from 'dotenv'

dotenv.config({ path: '.env.test' })

import Device from './src/lib/remarkableApi/internal/token/device.js'
import Session from './src/lib/remarkableApi/internal/token/session.js'

program
	.name('a-remarkable-api-debug-cli')
	.description('A CLI tool for debugging the reMarkable API')
	.version('0.1.0')

program.parse()

intro(`a reMarkable API debug CLI`)

let loop = true

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

		case 'exit':
			loop = false
			break
		default:
			loop = false
			break
	}
}

outro('Goodbye!')