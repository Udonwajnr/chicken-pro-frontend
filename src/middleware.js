import { NextResponse } from 'next/server';

export function middleware(request) {
  const token    = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;

  // ── Public routes — anyone can access ──
  const publicRoutes = ['/', '/login', '/register'];
  const isPublic     = publicRoutes.includes(pathname);

  // ── If no token ──
  if (!token) {
    // Trying to access a protected page → send to login
    if (!isPublic && pathname !== '/onboarding') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // ── If has token and tries to visit login/register → send to dashboard ──
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|fonts|images).*)',
  ],
};