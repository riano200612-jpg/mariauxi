/**
 * Temporary deny-all guard for the isolated Cloudflare Pages staging project.
 * This intentionally does not handle production mariauxi.com.
 * Remove only after Cloudflare Access has been configured and externally verified.
 */
export function onRequest({ request, next }) {
  const host = new URL(request.url).hostname.toLowerCase()
  const stagingHost = 'mariauxi-staging.pages.dev'

  if (host === stagingHost || host.endsWith(`.${stagingHost}`)) {
    return new Response('María Auxi staging cerrado temporalmente para auditoría de acceso.\n', {
      status: 403,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'cache-control': 'no-store',
        'x-content-type-options': 'nosniff',
        'x-robots-tag': 'noindex, nofollow',
        'content-security-policy': "default-src 'none'; frame-ancestors 'none'"
      }
    })
  }

  return next()
}
