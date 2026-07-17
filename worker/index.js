/**
 * Cloudflare Worker OAuth proxy for Decap CMS with the GitHub backend.
 * Required secrets: GITHUB_OAUTH_ID and GITHUB_OAUTH_SECRET.
 */

const STATE_COOKIE = 'decap_oauth_state';

function callbackUrl(url) {
  return `${url.origin}/callback?provider=github`;
}

function errorResponse(message, status = 400) {
  return new Response(message, {
    status,
    headers: {
      'cache-control': 'no-store',
      'content-type': 'text/plain; charset=utf-8',
      'x-content-type-options': 'nosniff',
    },
  });
}

function getCmsOrigin(env) {
  try {
    const origin = new URL(env.CMS_ORIGIN).origin;
    return origin.startsWith('https://') ? origin : null;
  } catch {
    return null;
  }
}

function getCookie(request, name) {
  const entry = request.headers
    .get('cookie')
    ?.split(';')
    .map(value => value.trim())
    .find(value => value.startsWith(`${name}=`));
  return entry?.slice(name.length + 1);
}

function callbackResponse(status, payload, cmsOrigin) {
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`.replace(/</g, '\\u003c');
  return new Response(`<!doctype html>
<html><head><meta charset="utf-8"><title>Autorizando Decap CMS</title></head>
<body><p>Autorizando Decap CMS…</p><script>
  const cmsOrigin = ${JSON.stringify(cmsOrigin)};
  const receiveMessage = event => {
    if (event.origin !== cmsOrigin || !window.opener) return;
    window.opener.postMessage(${JSON.stringify(message)}, cmsOrigin);
    window.removeEventListener('message', receiveMessage, false);
  };
  window.addEventListener('message', receiveMessage, false);
  window.opener?.postMessage('authorizing:github', cmsOrigin);
</script></body></html>`, {
    headers: {
      'cache-control': 'no-store',
      'content-security-policy': "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; base-uri 'none'",
      'content-type': 'text/html; charset=utf-8',
      'referrer-policy': 'no-referrer',
      'set-cookie': `${STATE_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`,
      'x-content-type-options': 'nosniff',
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cmsOrigin = getCmsOrigin(env);

    if (request.method !== 'GET') {
      return errorResponse('Method not allowed.', 405);
    }

    if (url.pathname === '/auth') {
      if (url.searchParams.get('provider') !== 'github') {
        return errorResponse('Invalid OAuth provider.');
      }
      if (!env.GITHUB_OAUTH_ID || !env.GITHUB_OAUTH_SECRET) {
        return errorResponse('Missing Worker OAuth secrets.', 500);
      }
      if (!cmsOrigin) {
        return errorResponse('Missing or invalid CMS_ORIGIN Worker variable.', 500);
      }

      const state = crypto.randomUUID();
      const authorization = new URL('https://github.com/login/oauth/authorize');
      authorization.search = new URLSearchParams({
        client_id: env.GITHUB_OAUTH_ID,
        redirect_uri: callbackUrl(url),
        scope: env.GITHUB_REPO_PRIVATE === '1' ? 'repo' : 'public_repo',
        state,
      }).toString();

      return new Response(null, {
        status: 302,
        headers: {
          location: authorization.toString(),
          'set-cookie': `${STATE_COOKIE}=${state}; Path=/; Max-Age=600; HttpOnly; Secure; SameSite=Lax`,
        },
      });
    }

    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      if (!cmsOrigin) {
        return errorResponse('Missing or invalid CMS_ORIGIN Worker variable.', 500);
      }
      if (url.searchParams.get('provider') !== 'github' || !code) {
        return callbackResponse('error', { error: 'Invalid OAuth callback.' }, cmsOrigin);
      }
      if (!state || state !== getCookie(request, STATE_COOKIE)) {
        return callbackResponse('error', { error: 'Invalid OAuth state.' }, cmsOrigin);
      }
      if (!env.GITHUB_OAUTH_ID || !env.GITHUB_OAUTH_SECRET) {
        return callbackResponse('error', { error: 'Missing Worker OAuth secrets.' }, cmsOrigin);
      }

      let tokenResponse;
      let token;
      try {
        tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: env.GITHUB_OAUTH_ID,
            client_secret: env.GITHUB_OAUTH_SECRET,
            code,
            redirect_uri: callbackUrl(url),
          }),
        });
        token = await tokenResponse.json();
      } catch {
        return callbackResponse('error', { error: 'Unable to contact GitHub.' }, cmsOrigin);
      }

      if (!tokenResponse.ok || !token.access_token) {
        return callbackResponse('error', { error: token.error || 'Unable to obtain GitHub token.' }, cmsOrigin);
      }
      return callbackResponse('success', { token: token.access_token }, cmsOrigin);
    }

    return errorResponse('Not found.', 404);
  },
};
