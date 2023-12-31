import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {getConfig} from './config'
import {getTool} from './tool'
import path from 'path'
import {existsSync, chmod} from 'fs'

async function run(): Promise<void> {
  try {
    const config = getConfig()
    const tool = await getTool(config)
    const binary = path.join(tool, 'c8y')

    if (!existsSync(binary)) {
      core.error(`binary does not exist. binary=${binary}`)
    }

    core.debug(`making binary executable: ${binary}`)
    chmod(binary, 0o0755, err => {
      if (err) {
        throw err
      }
    })

    core.debug(`adding to path: ${tool}`)
    core.addPath(tool)

    if (config.showVersion) {
      core.debug(`showing version: binary=${binary}`)
      await exec.exec('c8y', ['version', '--output', 'table'], {})
    }

    if (config.showTenant) {
      await exec.exec(
        `c8y sessions get -o json --select host,tenant,version`,
        [],
        {
          ignoreReturnCode: true
        }
      )
    }

    if (config.command) {
      core.debug(`running command: ${config.command}`)
      await exec.exec(config.command, [], {})
    }
    core.setOutput('c8y', binary)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
