import 'server-only';

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

export function forbidden(message = 'Forbidden') {
  return new ApiError(message, 403);
}

export function badRequest(message = 'Bad request') {
  return new ApiError(message, 400);
}
