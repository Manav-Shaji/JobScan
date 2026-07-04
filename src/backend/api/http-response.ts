import 'server-only';
import { NextResponse } from 'next/server';

/**
 * Standard API Envelope format
 */
export interface StandardApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  timestamp: string;
  errors?: any[];
}

/**
 * Helper to return standard success response
 */
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

/**
 * Helper to return standard error response
 */
export function errorResponse(message: string, status = 500, errors?: any[]) {
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

// Keep original APIs for full backwards compatibility
function successJson(payload: any, status = 200) {
  return NextResponse.json(payload, { status });
}

function errorJson(payload: any, status = 500) {
  return NextResponse.json(payload, { status });
}
