import { Request, Response, NextFunction } from 'express';
import { StudyApiError } from '../services/gemini.service.js';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log diagnostic error details on server ONLY
  console.error('[Backend Express Error Handler]:', {
    name: err.name,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  if (err instanceof StudyApiError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
    return;
  }

  // Fallback for unhandled unexpected errors (never expose stack traces or raw details)
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'We could not process your request right now. Please try again.',
    },
  });
}
