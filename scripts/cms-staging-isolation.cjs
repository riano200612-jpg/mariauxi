'use strict'

// Decap CMS isolation applies ONLY to generated Cloudflare Pages staging output.
// Do not edit admin/config.yml in the source tree: main must keep its own backend.
const fs = require('node:fs')
const path = require('node:path')

const stagingBranch = 'audit/cms-phase1-security-2026-10-23'
const isPages = process.env.CF_PAGES === '1'
const deployedBranch = process.env.CF_PAGES_BRANCH || ''

if (!isPages) {
  console.log('CMS staging isolation: local/CI build; no changes to backend')
} else if (deployedBranch === 'main') {
  console.log('CMS staging isolation: main build; backend unchanged')
} else if (deployedBranch !== stagingBranch) {
  throw new Error('CMS staging isolation: unexpected Cloudflare branch, refusing to deploy')
} else {
  const output = path.join(process.cwd(), '_site', 'admin', 'config.yml')
  const content = fs.readFileSync(output, 'utf8')
  const expected = /^backend:\r?\n  name: github\r?\n  repo: riano200612-jpg\/mariauxi\r?\n  branch: main\r?\n  base_url: https:\/\/mariauxi-oauth\.riano200612\.workers\.dev\r?\n  auth_endpoint: auth\r?\n/

  if (!expected.test(content)) {
    throw new Error('CMS staging isolation: unexpected backend config, refusing to deploy')
  }

  const isolated = content.replace(expected, 'backend:\n  name: test-repo\n')
  if (
    !isolated.startsWith('backend:\n  name: test-repo\n') ||
    isolated.includes('mariauxi-oauth.riano200612.workers.dev') ||
    /^  branch:\s*main\s*$/m.test(isolated)
  ) {
    throw new Error('CMS staging isolation: verification failed')
  }

  fs.writeFileSync(output, isolated, 'utf8')
  console.log('CMS staging isolation: test-repo backend enabled; no GitHub writes or production OAuth')
}
