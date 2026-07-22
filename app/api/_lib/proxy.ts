import { NextRequest, NextResponse } from 'next/server';

// This is the base URL of the upstream API that this proxy forwards requests to.

const UPSTREAM_BASE = process.env.UPSTREAM_BASE_URL ?? 'http://35.154.33.187:4000';

/**
 * verify-otp sets an httpOnly `accessToken` cookie (Secure; SameSite=None) that gates
 * employee/details, update/emails, fetch/uan, fetch/crif and the email-OTP endpoints.
 * This proxy forwards the browser's cookie upstream, and forwards any upstream
 */
export async function proxyToUpstream(
  req: NextRequest,
  upstreamPath: string,
  opts?: { method?: 'GET' | 'POST' | 'PUT' }
) {
  const method = opts?.method ?? 'POST';

  const headers: Record<string, string> = {
    'x-api-key': process.env.PAN_API_KEY ?? '',
  };
  const cookie = req.headers.get('cookie');
  if (cookie) headers['cookie'] = cookie;

  let body: string | undefined;
  if (method === 'POST' || method === 'PUT') {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(await req.json());
  }

  const upstream = await fetch(`${UPSTREAM_BASE}${upstreamPath}`, {
    method,
    headers,
    redirect: 'manual',
    ...(body !== undefined ? { body } : {}),
  });


  if (upstream.status >= 300 && upstream.status < 400) {
    const location = upstream.headers.get('location');
    return NextResponse.json({
      success: true,
      message: 'Redirect',
      data: { url: location },
      errors: null,
      timestamp: new Date().toISOString(),
    });
  }

  const data = await upstream.json();
  const res = NextResponse.json(data, { status: upstream.status });

  const setCookies =
    typeof upstream.headers.getSetCookie === 'function'
      ? upstream.headers.getSetCookie()
      : upstream.headers.get('set-cookie')
      ? [upstream.headers.get('set-cookie')!]
      : [];

  for (const raw of setCookies) {
    res.headers.append('Set-Cookie', adjustCookieForEnv(raw));
  }

  return res;
}

/**
 * Streams a multipart/form-data request straight through to upstream, preserving the
 * original Content-Type (and its multipart boundary) so files aren't buffered/re-encoded here.
 */
export async function proxyMultipartToUpstream(req: NextRequest, upstreamPath: string) {
  const headers: Record<string, string> = {
    'x-api-key': process.env.PAN_API_KEY ?? '',
  };
  const cookie = req.headers.get('cookie');
  if (cookie) headers['cookie'] = cookie;
  const contentType = req.headers.get('content-type');
  if (contentType) headers['content-type'] = contentType;

  const upstream = await fetch(`${UPSTREAM_BASE}${upstreamPath}`, {
    method: 'POST',
    headers,
    body: req.body,
    duplex: 'half',
  } as RequestInit & { duplex: 'half' });

  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}

function adjustCookieForEnv(rawCookie: string) {
  if (process.env.NODE_ENV !== 'production') {
    // Browsers drop `Secure` + `SameSite=None` cookies over plain http://localhost.
    return rawCookie.replace(/;\s*SameSite=None/i, '; SameSite=Lax').replace(/;\s*Secure/i, '');
  }
  // Browsers silently drop `SameSite=None` cookies missing `Secure`. The upstream
  // only sets `Secure` when its own NODE_ENV is 'production', which it may not be
  // even though we're serving over HTTPS — so enforce it here regardless.
  if (/;\s*SameSite=None/i.test(rawCookie) && !/;\s*Secure/i.test(rawCookie)) {
    return `${rawCookie}; Secure`;
  }
  return rawCookie;
}
