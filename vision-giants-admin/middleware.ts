// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === '/login') {
    return NextResponse.next();
  }

  const token = req.cookies.get('admin_token')?.value;

  if (!token) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - api routes (backend handles its own auth)
     * - static files, images, favicon
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};