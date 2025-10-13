import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Block all demo auth pages and unused auth methods
  const blockedPaths = [
    '/auth/amplify',
    '/auth/auth0',
    '/auth/firebase',
    '/auth/supabase',
    '/auth-demo',
  ];

  // Check if the pathname starts with any blocked path
  const isBlockedPath = blockedPaths.some((path) => pathname.startsWith(path));

  if (isBlockedPath) {
    // Redirect to 404 page
    return NextResponse.redirect(new URL('/404', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};

