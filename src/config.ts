import * as core from '@actions/core'

export interface Config {
  uri?: string
  version?: string
  command?: string
  subPath?: string
  showVersion?: boolean
  showTenant?: boolean
  preserveStdin?: boolean
}

export function getConfig(): Config {
  const version: string = core.getInput('version') || 'latest'
  const command: string = core.getInput('command') || ''
  const uri: string = core.getInput('uri') || ''
  const showVersion: boolean = core.getBooleanInput('showVersion')
  const showTenant: boolean = core.getBooleanInput('showTenant')
  const preserveStdin: boolean = core.getBooleanInput('preserveStdin')

  const config = {
    version,
    uri,
    command,
    preserveStdin,
    showVersion,
    showTenant
  }
  return config
}
