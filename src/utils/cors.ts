import { NextApiRequest, NextApiResponse } from 'next';

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : '',
].filter(Boolean);

function getOrigin(req: NextApiRequest): string {
  const origin = req.headers.origin || '';

  // Allow same-origin requests (no origin header)
  if (!origin) return '*';

  // In development, allow localhost
  if (process.env.NODE_ENV === 'development') return origin;

  // Allow Vercel preview deployments
  if (origin.endsWith('.vercel.app')) return origin;

  // Allow explicitly configured origins
  if (ALLOWED_ORIGINS.includes(origin)) return origin;

  return '';
}

export function setCorsHeaders(req: NextApiRequest, res: NextApiResponse): boolean {
  const origin = getOrigin(req);

  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400');
  }

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }

  return false;
}
