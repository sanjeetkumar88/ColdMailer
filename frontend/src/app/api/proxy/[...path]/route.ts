import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

async function handleProxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  const headers = new Headers(req.headers);
  // Ensure the backend receives the accessToken
  if (token?.accessToken) {
    const currentCookies = headers.get('cookie') || '';
    const newCookieString = currentCookies 
      ? `${currentCookies}; accessToken=${token.accessToken}`
      : `accessToken=${token.accessToken}`;
    headers.set('cookie', newCookieString);
  }

  headers.delete('host');

  const path = req.nextUrl.pathname.replace('/api/proxy', '/api');
  const query = req.nextUrl.search;

  try {
    const backendRes = await fetch(`http://127.0.0.1:5000${path}${query}`, {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? await req.blob() : undefined,
      redirect: 'manual', // Prevent proxy from following redirects (important for OAuth)
    });

    const responseHeaders = new Headers(backendRes.headers);
    responseHeaders.delete('content-encoding');
    responseHeaders.delete('content-length');
    responseHeaders.delete('transfer-encoding');

    const data = await backendRes.arrayBuffer();

    return new NextResponse(data, {
      status: backendRes.status,
      headers: responseHeaders
    });
  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json({ error: 'Failed to proxy API request' }, { status: 500 });
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
export const PATCH = handleProxy;
