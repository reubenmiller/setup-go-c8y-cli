import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import { Config } from './config'
import { extract } from './extract'
import { tmpdir } from 'os'
import { lstatSync, existsSync } from 'fs'
import path from 'path'
import 'cross-fetch/polyfill'

const C8Y = 'c8y'


async function getLatestVersion(url: string): Promise<string> {
  try {
    const response = await fetch(url, { method: 'GET', redirect: 'follow' })
    return response.url.split('/').splice(-1)[0]
  } catch (err) {
    console.info(err + " url: " + url);
  }
  return ''
}

const getDownloadUri = (version: string) => {
  if (!version.startsWith('v')) {
    version = 'v' + version
  }

  let platformName = 'linux'
  if (['linux'].includes(process.platform)) {
    platformName = 'linux'
  } else if (['darwin'].includes(process.platform)) {
    platformName = 'macOS'
  } else if (['win32', 'cygwin'].includes(process.platform)) {
    platformName = 'windows'
  } else {
    // TODO: Handle unsupported platforms
  }

  let archName = 'amd64'
  if (['arm64'].includes(process.arch)) {
    archName = 'arm64'
  } else if (['x64'].includes(process.arch)) {
    archName = 'amd64'
  } else if (['arm'].includes(process.arch)) {
    archName = 'armv7'
  } else {
    // TODO: Handle unsupported platforms
  }

  const binaryName = [C8Y, platformName, archName].join('_')
  return `https://github.com/reubenmiller/go-c8y-cli/releases/download/${version}/${binaryName}`
};


export async function getTool(config: Config = {}): Promise<string> {
  process.env.RUNNER_TOOL_CACHE = process.env.RUNNER_TOOL_CACHE || tmpdir()
  process.env.RUNNER_TEMP = process.env.RUNNER_TEMP || tmpdir()

  const binaryName = C8Y
  if (!config.version) {
    config.version = 'latest'
  }

  if (config.version == 'latest') {
    const latestVersion = await getLatestVersion('https://github.com/reubenmiller/go-c8y-cli/releases/latest')
    if (/^v?\d+\.\d+\.\d+.*$/i.test(latestVersion)) {
      config.version = latestVersion
    }
  }

  if (!config.uri) {
    config.uri = getDownloadUri(config.version)
  }

  const outPath = (p: string): string => {
    if (config.subPath) {
      return path.join(p, config.subPath)
    }
    return p
  }

  const cachedPath = tc.find(binaryName, config.version)
  if (cachedPath && existsSync(path.join(cachedPath, C8Y))) {
    return outPath(cachedPath)
  }

  core.info(`downloading tool from uri: ${config.uri}`)
  const download = await tc.downloadTool(config.uri)
  const extractedPath = await extract(config.uri, download)
  core.debug(`extractedPath: ${extractedPath}`)

  if (lstatSync(extractedPath).isDirectory()) {
    const p = await tc.cacheDir(extractedPath, binaryName, config.version)
    return outPath(p)
  }
  return await tc.cacheFile(
    extractedPath,
    binaryName,
    binaryName,
    config.version
  )
}