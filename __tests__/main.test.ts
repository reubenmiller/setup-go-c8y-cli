import {Config} from '../src/config'
import {getTool} from '../src/tool'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'


test('downloads and extracts tool with latest version', async () => {
  const path = await getTool()

  let expectedSuffix = /c8y\/\d+\.\d+\.\d+\/arm64$/
  if (process.arch == 'x64') {
    expectedSuffix = /c8y\/\d+\.\d+\.\d+\/amd64$/
  }
  expect(expectedSuffix.test(path)).toBeTruthy()
})

test('downloads and extracts tool with explicit version', async () => {
  const config: Config = {
    version: '2.35.0',
  }

  const path = await getTool(config)

  let expectedSuffix = '/c8y/2.35.0/arm64'
  if (process.arch == 'x64') {
    expectedSuffix = '/c8y/2.35.0/amd64'
  }
  expect(path.endsWith(expectedSuffix)).toBeTruthy()
})

test('downloads and extracts tool and executes a command', async () => {
  const config: Config = {
    version: '2.35.0',
    command: 'c8y version'
  }

  const path = await getTool(config)

  let expectedSuffix = '/c8y/2.35.0/arm64'
  if (process.arch == 'x64') {
    expectedSuffix = '/c8y/2.35.0/amd64'
  }
  expect(path.endsWith(expectedSuffix)).toBeTruthy()
})
