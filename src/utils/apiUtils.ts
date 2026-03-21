import { NextApiResponse } from 'next';

export type ApiError = {
  message: string;
  code?: string;
  status: number;
};

export class ApiException extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number = 500, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = 'ApiException';
  }
}

export const errorHandler = (error: unknown, res: NextApiResponse) => {
  console.error('API Error:', error);
  
  if (error instanceof ApiException) {
    return res.status(error.status).json({
      error: {
        message: error.message,
        code: error.code,
      },
    });
  }

  return res.status(500).json({
    error: {
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      code: 'internal_server_error',
    },
  });
};

export const validateMethod = (req: Request, res: NextApiResponse, allowedMethods: string[]) => {
  const method = req.method as string;
  
  if (!allowedMethods.includes(method)) {
    throw new ApiException(`Method ${method} not allowed`, 405, 'method_not_allowed');
  }
};

export const validateBody = <T extends Record<string, unknown>>(
  data: unknown,
  requiredFields: (keyof T)[]
): T => {
  if (!data) {
    throw new ApiException('Request body is empty', 400, 'missing_request_body');
  }

  for (const field of requiredFields) {
    if (data && typeof data === 'object' && field in data) {
      const dataObj = data as Record<string, unknown>;
      if (dataObj[field as string] === undefined || dataObj[field as string] === null) {
        throw new ApiException(`Missing required field: ${String(field)}`, 400, 'missing_required_field');
      }
    } else {
      throw new ApiException(`Missing required field: ${String(field)}`, 400, 'missing_required_field');
    }
  }

  return data as T;
};

export const getApiUrl = () => {
  if (process.env.NODE_ENV === "development") {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // In production, use relative URLs since frontend and API are on the same origin.
  // Using NEXT_PUBLIC_VERCEL_URL causes CORS issues when the access domain differs
  // from the deployment URL (e.g., custom domains or preview URLs).
  return '/api';
};
