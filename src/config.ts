import * as core from '@actions/core'

export interface Config {
  uri?: string
  version?: string
  command?: string
  subPath?: string
  showVersion?: boolean
}

export function getConfig(): Config {
  let version: string = core.getInput('version') || 'latest'
  const command: string = core.getInput('command') || ''
  const uri: string = core.getInput('uri') || ''
  const showVersion: boolean = core.getBooleanInput('showVersion')

  const config = {
    version,
    uri,
    command,
    showVersion,
  }
  return config
}