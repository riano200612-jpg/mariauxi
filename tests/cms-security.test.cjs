const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const read = p => fs.readFileSync(path.join(root, p), 'utf8')
const config = read('admin/config.yml')

test('CMS uses editorial workflow for staged review', () => {
  assert.match(config, /^publish_mode:\s*editorial_workflow\s*$/m)
  assert.match(config, /^\s*name:\s*github\s*$/m)
  assert.match(config, /^\s*repo:\s*riano200612-jpg\/mariauxi\s*$/m)
})
test('CMS OAuth endpoints are declared', () => {
  assert.match(config, /^\s*base_url:\s*https:\/\//m)
  assert.match(config, /^\s*auth_endpoint:\s*auth\s*$/m)
})
test('CMS keeps media paths under upload directory', () => {
  assert.match(config, /^media_folder:\s*["']?img\/uploads["']?\s*$/m)
  assert.match(config, /^public_folder:\s*["']?\/img\/uploads["']?\s*$/m)
})
test('Do not commit OAuth secrets in Worker configuration', () => {
  const wrangler = read('wrangler.toml')
  assert.doesNotMatch(wrangler, /^\s*GITHUB_OAUTH_(ID|SECRET)\s*=\s*["'][^"']+["']\s*$/m)
})
test('Project collection permits creation and has required fields', () => {
  assert.match(config, /name:\s*["']proyectos["']/)
  assert.match(config, /create:\s*true/)
  for (const field of ['title', 'precio', 'estado']) {
    assert.ok(config.includes('name: "' + field + '"'), 'Field ' + field + ' is required')
  }
})
