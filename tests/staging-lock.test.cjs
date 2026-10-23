const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

let modulePromise
function guard() {
  if (!modulePromise) {
    const script = fs.readFileSync(path.join(__dirname, '../functions/_middleware.js'), 'utf8')
    modulePromise = import(`data:text/javascript;base64,${Buffer.from(script).toString('base64')}`)
  }
  return modulePromise
}

for (const url of [
  'https://mariauxi-staging.pages.dev/',
  'https://mariauxi-staging.pages.dev/admin/index.html',
  'https://mariauxi-staging.pages.dev/admin/config.yml',
  'https://abc123.mariauxi-staging.pages.dev/',
  'https://abc123.mariauxi-staging.pages.dev/img/uploads/auxi_hero.mp4'
]) {
  test(`Staging lock refuses unauthenticated ${new URL(url).pathname} on ${new URL(url).hostname}`, async () => {
    const { onRequest } = await guard()
    let nextCalled = false
    const response = await onRequest({
      request: new Request(url),
      next: () => { nextCalled = true; return new Response('UNPROTECTED') }
    })
    assert.equal(response.status, 403)
    assert.equal(nextCalled, false)
    assert.equal(response.headers.get('cache-control'), 'no-store')
  })
}

test('Guard does not intercept production mariauxi.com', async () => {
  const { onRequest } = await guard()
  let count = 0
  const response = await onRequest({
    request: new Request('https://mariauxi.com/'),
    next: () => { count += 1; return new Response('Production remains unaffected', { status: 200 }) }
  })
  assert.equal(response.status, 200)
  assert.equal(count, 1)
})

test('Guard does not block other Pages projects', async () => {
  const { onRequest } = await guard()
  let nextCalled = false
  const response = await onRequest({
    request: new Request('https://adphor-platform.pages.dev/'),
    next: () => { nextCalled = true; return new Response('ok') }
  })
  assert.equal(response.status, 200)
  assert.equal(nextCalled, true)
})
