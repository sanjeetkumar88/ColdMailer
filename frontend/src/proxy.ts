import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export default async function proxy(req: NextRequest) {
  // Protect dashboard and onboarding routes
  if (req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname.startsWith('/onboarding')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Inject accessToken for API and GraphQL proxy routes
  if (req.nextUrl.pathname.startsWith('/api/proxy') || req.nextUrl.pathname.startsWith('/graphql')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const requestHeaders = new Headers(req.headers);

    if (token?.accessToken) {
      console.log("✅ Token found in proxy:", token.accessToken.substring(0, 10) + "...");
      const currentCookies = requestHeaders.get('cookie') || '';
      const newCookies = currentCookies
        ? `${currentCookies}; accessToken=${token.accessToken}`
        : `accessToken=${token.accessToken}`;
      requestHeaders.set('cookie', newCookies);
    } else {
      console.log("❌ No accessToken found in NextAuth token:", token);
    }

    console.log("Sending headers to backend:", requestHeaders.get('cookie'));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/proxy/:path*', '/graphql', '/dashboard/:path*', '/onboarding/:path*'],
};
