import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

// Paths that are public (accessible without authentication)
const publicPaths = ['/', '/login', '/register'];

// Auth paths that should redirect to dashboard if already authenticated
const authPaths = ['/login', '/register'];

// JWT Secret - in production, use environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if path is public
  const isPublicPath = publicPaths.some(path => path === pathname);
  
  // Check if path is an auth path (login/register)
  const isAuthPath = authPaths.some(path => pathname === path);
  
  // Get authentication token from cookies
  const token = request.cookies.get('token')?.value;
  
  // Verify the token is valid
  let isAuthenticated = false;
  if (token) {
    try {
      verify(token, JWT_SECRET);
      isAuthenticated = true;
    } catch (error) {
      isAuthenticated = false;
    }
  }
  
  // Case 1: Non-public route but not authenticated
  if (!isPublicPath && !isAuthenticated) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  // Case 2: Auth page but already authenticated
  if (isAuthPath && isAuthenticated) {
    const url = new URL('/dashboard', request.url);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - API routes (/api/*)
     * - Static files (/_next/*, /images/*, etc.)
     * - Favicon
     */
    '/((?!api|_next/static|_next/image|images|favicon.ico).*)',
  ],
}; 