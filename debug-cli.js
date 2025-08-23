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
}