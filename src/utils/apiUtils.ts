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

export const validateBody = <T extends Record<string, any>>(
  data: any, 
  requiredFields: (keyof T)[]
): T => {
  if (!data) {
    throw new ApiException('Request body is empty', 400, 'missing_request_body');
  }

  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null) {
      throw new ApiException(`Missing required field: ${String(field)}`, 400, 'missing_required_field');
    }
  }

  return data as T;
}; 