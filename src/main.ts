import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {getConfig} from './config'
import {getTool} from './tool'
import path from 'path'
import { existsSync, chmod } from 'fs'


async function run(): Promise<void> {
  try {
    const config = getConfig()
    const tool = await getTool(config)
    const binary = path.join(tool, 'c8y')

    if (!existsSync(binary)) {
      core.error(`binary does not exist. binary=${binary}`)
    }

    core.info(`making binary executable: ${binary}`)
    chmod(binary, 0o0755, (err) => {
      if (err) {
        throw err
      }
    })

    core.info(`adding to path: ${tool}`)
    core.addPath(tool)

    if (config.showVersion) {
      core.info(`showing version: binary=${binary}`)
      await exec.exec("c8y", ['version', '--output', 'table'], {})
    }

    if (config.showTenant) {
      await exec.exec(`c8y sessions get -o json --select host,tenant,version`, [], {
        ignoreReturnCode: true,
      })
    }

    if (config.command) {
      core.info(`running command: ${config.command}`)
      await exec.exec(config.command, [], {})
    }
    // core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
