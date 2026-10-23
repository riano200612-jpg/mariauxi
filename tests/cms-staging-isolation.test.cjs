'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const os = require('node:os')
const { spawnSync } = require('node:child_process')

const script = path.resolve(__dirname, '../scripts/cms-staging-isolation.cjs')
const source = fs.readFileSync(path.resolve(__dirname, '../admin/config.yml'), 'utf8')
const staging = 'audit/cms-phase1-security-2026-10-23'

function execute(branch, { pages = true, sourceConfig = source } = {}) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mariauxi-cms-'))
  const admin = path.join(tmp, '_site', 'admin')
  fs.mkdirSync(admin, { recursive: true })
  const file = path.join(admin, 'config.yml')
  fs.writeFileSync(file, sourceConfig, 'utf8')
  const env = { ...process.env }
  delete env.CF_PAGES
  delete env.CF_PAGES_BRANCH
  if (pages) env.CF_PAGES = '1'
  if (branch !== undefined) env.CF_PAGES_BRANCH = branch
  const result = spawnSync(process.execPath, [script], {
    cwd: tmp,
    env,
    encoding: 'utf8'
  })
  const content = fs.readFileSync(file, 'utf8')
  fs.rmSync(tmp, { force: true, recursive: true })
  return { ...result, content }
}

test('staging artifact uses the fake backend, not GitHub or OAuth', () => {
  const r = execute(staging)
  assert.equal(r.status, 0, r.stderr)
  assert.match(r.content, /^backend:\n  name: test-repo\n/m)
  assert.doesNotMatch(r.content, /mariauxi-oauth|branch:\s*main/)
  assert.match(r.content, /^publish_mode: editorial_workflow$/m)
  assert.match(r.content, /^collections:$/m)
})

test('Cloudflare main build preserves the production backend unchanged', () => {
  const r = execute('main')
  assert.equal(r.status, 0, r.stderr)
  assert.equal(r.content, source)
})

test('local and CI builds preserve the production backend unchanged', () => {
  const r = execute(undefined, { pages: false })
  assert.equal(r.status, 0, r.stderr)
  assert.equal(r.content, source)
})

test('unexpected Cloudflare branches fail closed without changing backend', () => {
  const r = execute('some-unexpected-branch')
  assert.notEqual(r.status, 0)
  assert.equal(r.content, source)
})

test('missing Cloudflare branch fails closed without changing backend', () => {
  const r = execute(undefined)
  assert.notEqual(r.status, 0)
  assert.equal(r.content, source)
})

test('staging fails closed if the source CMS config differs', () => {
  const changed = source.replace('  branch: main', '  branch: dangerous')
  const r = execute(staging, { sourceConfig: changed })
  assert.notEqual(r.status, 0)
  assert.equal(r.content, changed)
})
