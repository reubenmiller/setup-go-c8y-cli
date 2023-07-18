import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {getConfig} from './config'
import {getTool} from './tool'
import chmodr from 'chmodr'
import path from 'path'


async function run(): Promise<void> {
  try {
    const config = getConfig()
    const tool = await getTool(config)

    core.info(`making binary executable: ${tool}`)
    chmodr(tool, 0o0755, err => {
      if (err) {
        throw err
      }
    })
    core.info(`adding to path: ${tool}`)
    core.addPath(tool)

    if (config.showVersion) {
      await exec.exec(path.join(tool, 'c8y'), ['version'], {})
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
