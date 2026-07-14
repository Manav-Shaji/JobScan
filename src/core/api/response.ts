/**
 * ------------------------------------------------------------
 * File: response.ts
 * 
 * Purpose:
 * Standardized API response formatting and custom error classes.
 * 
 * Responsibilities:
 * • Define ApiError class for structured error handling
 * • Provide helpers for unauthorized and bad request errors
 * • Format consistent JSON responses
 * 
 * Used By:
 * • route-utils.ts
 * • API Routes
 * ------------------------------------------------------------
 */

import 'server-only';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { logger } from '@/core/lib/logger';

// --- Error Classes ---

export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export function unauthorized(message = 'Not authorized') {
  return new ApiError(message, 401);
}

export function badRequest(message = 'Bad request') {
  return new ApiError(message, 400);
}

// --- Response Helpers ---

interface StandardApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  timestamp: string;
  errors?: any[];
}

export function successResponse<T>(data: T, message = 'Success', status = 200) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

function errorResponse(message: string, status = 500, errors?: any[]) {
  return NextResponse.json(
    {
      success: false,
      message,
      data: null,
      timestamp: new Date().toISOString(),
      errors,
    },
    { status }
  );
}

// --- Centralized Error Handler ---

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
    if (process.env.NODE_ENV === 'production') {
      message = 'Internal Server Error';
    }
  } else {
    logger.warn(`API Client Error (${status}): ${message}`, { errors });
  }

  return errorResponse(message, status, errors);
}
