import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_METHODS = 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
const ALLOWED_HEADERS = 'Content-Type, Authorization';

function getAllowedOrigin(origin: string | null): string {
  if (!origin) return '';

  // In development, allow localhost origins
  if (process.env.NODE_ENV === 'development') return origin;

  // Allow Vercel preview deployments
  if (origin.endsWith('.vercel.app')) return origin;

  // Allow configured app URL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl && origin === appUrl) return origin;

  return '';
}

export function proxy(request: NextRequest) {
  const origin = request.headers.get('origin');
  const allowedOrigin = getAllowedOrigin(origin);

  // Handle preflight OPTIONS requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin || '*',
        'Access-Control-Allow-Methods': ALLOWED_METHODS,
        'Access-Control-Allow-Headers': ALLOWED_HEADERS,
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // For non-preflight requests, add CORS headers to the response
  const response = NextResponse.next();

  if (allowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
    response.headers.set('Access-Control-Allow-Methods', ALLOWED_METHODS);
    response.headers.set('Access-Control-Allow-Headers', ALLOWED_HEADERS);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
