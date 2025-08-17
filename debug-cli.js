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

/**
 * Workflow to regenerate text fixtures.
 *
 * 1. Clear existing fixtures.
 * 2. Generates new device and session tokens.
 * 3. Runs the test suite to regenerate new fixtures.
 * 4. Saves the new fixtures.
 * 5. Anonymizes fixtures and kills device connection.
 *
 * This way we can safely regenerate fixtures and keep
 * them anonymous, avoiding any potentially sensitive
 * information in the fixtures.
 */
const regenerateTextFixtures = async () => {
	const s = spinner()

	log.step('1. Clearing existing HTTP record fixtures ...')

	fs.rmSync('./test/fixtures/http-records', { recursive: true, force: true })
	fs.mkdirSync('./test/fixtures/http-records', { recursive: true })

	log.success('Fixtures under test/fixtures/http-records were cleared!')

	log.step('2. Generating new device connection token')

	let device = null
	if (process.env.REMARKABLE_DEVICE_TOKEN) {
		device = new Device(process.env.REMARKABLE_DEVICE_TOKEN)
		log.success(`
						Found reMarkable device connection token in configuration:
						- token: ${device.token}
						- device ID: ${device.deviceId}
						- description: ${device.description}
						- issued at: ${device.issuedAt.toISOString()}
					`.replace(/\t/g, ''))
	}

	log.step('3. Generating new session token')

	let session = null
	if (process.env.REMARKABLE_SESSION_TOKEN)
		session = new Session(process.env.REMARKABLE_SESSION_TOKEN)

	if (!session) {
		log.info('No session token found in configuration, fetching a new one ...')
		session = await Session.from(device)
		log.success(`
						New session token fetched successfully:
						- token: ${session.token}
						- expiration: ${session.expiredAt.toISOString()}
						Dumping session token to .env.test file ...
					`.replace(/\t/g, ''))

		fs.appendFileSync('.env.test', `\nREMARKABLE_SESSION_TOKEN=${session.token}\n`)
	} else {
		if(session.expired) {
			log.info('Session token found in configuration, but it is expired ...')
			session = await Session.from(device)
			log.success(`
							New session token fetched successfully:
							- token: ${session.token}
							- expiration: ${session.expiredAt.toISOString()}
							Dumping session token to .env.test file ...
						`.replace(/\t/g, ''))
			fs.appendFileSync('.env.test', `\nREMARKABLE_SESSION_TOKEN=${session.token}\n`)
		}
	}

	log.step('4. Running test suite to regenerate text fixtures ...')

	s.start('running HTTP library specs ...')
	shell.exec('yarn test test/lib/utils')
	s.stop('All specs executed ...')
}

const command = await select({
	message: 'What do you want to debug?',
	options: [
		{
			value: 'regenerateTextFixtures',
			label: '- Regenerate test fixtures',
			hint: 'Clear fixtures and re-runs test suite to regenerate new ones.',
		},
		{
			value: 'integrationTests',
			label: '- Run integration tests',
			hint: 'Runs set of operations against the reMarkable API to ensure the system works as expected.',
		},
		{
			value: 'interactWithApi',
			label: '- Interact with the API',
			hint: 'Navigate through the reMarkable cloud using the API.',
		},
	],
})

switch(command) {
	case 'regenerateTextFixtures':
		await regenerateTextFixtures()
		break
	case 'integrationTests':
		text('Integration tests are not implemented yet.')
		break
	case 'interactWithApi':
		text('Interacting with the API is not implemented yet.')
		break
	default:
		outro('No valid command selected. Exiting...')
}