import 'server-only';
import { ZodError } from 'zod';
import { ApiError } from './errors';
import { errorResponse } from './http-response';
import { logger } from '@/backend/logging/logger';

/**
 * Global, centralized error standardizer and formatter.
 * Gracefully normalizes database failures, Zod validations, and AI execution problems.
 */
export function apiError(error: any, defaultStatus: number = 500) {
  let message = 'An unexpected error occurred';
  let errors: any[] = [];
  let status = defaultStatus;

  if (error instanceof ZodError) {
    message = 'Validation failed';
    errors = error.issues.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    status = 400;
  } else if (error instanceof ApiError) {
    message = error.message;
    status = error.status;
  } else if (error instanceof Error) {
    message = error.message || message;
    
    // Graceful handling of DB failures / table relation issues
    const isDbError = 
      error.message.includes('relation') || 
      error.message.includes('column') || 
      error.message.includes('database') || 
      error.message.includes('connection') ||
      (error as any).code?.startsWith('23') ||
      (error as any).code?.startsWith('42');
      
    if (isDbError) {
      logger.error('Database connection or query execution failure detected', error);
      message = 'A database operations error occurred. Please try again.';
      status = 500;
    }
  } else if (typeof error === 'string') {
    message = error;
  }

  if (status >= 500) {
    logger.error(`API 500 failure: ${message}`, error);
    // Mask internal details in production
    if (process.env.NODE_ENV === 'production') {
      message = 'Internal Server Error';
    }
  } else {
    logger.warn(`API Client Error (${status}): ${message}`, { errors });
  }

  return errorResponse(message, status, errors);
}
