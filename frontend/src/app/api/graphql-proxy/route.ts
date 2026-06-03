// Force Vercel deployment trigger (testing new webhook)
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function POST(req: NextRequest) {
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

  // Remove host to avoid conflicts
  headers.delete('host');

  try {
    const BACKEND_URL = process.env.BACKEND_API_URL 
      ? process.env.BACKEND_API_URL.replace(/\/api$/, '') 
      : 'http://127.0.0.1:5000';

    const backendRes = await fetch(`${BACKEND_URL}/graphql`, {
      method: 'POST',
      headers,
      body: await req.text()
    });

    const data = await backendRes.json();
    
    return NextResponse.json(data, {
      status: backendRes.status
    });
  } catch (error) {
    console.error('GraphQL Proxy Error:', error);
    return NextResponse.json({ error: 'Failed to proxy GraphQL request' }, { status: 500 });
  }
}
