import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import { AppError } from '../errors/AppError';
import logger from '../../config/logger';

const isDev = process.env.NODE_ENV === 'development';

const handleMongooseCastError = (err: MongooseError.CastError): AppError =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleMongooseDuplicateKey = (err: any): AppError => {
  const field = Object.keys(err.keyValue)[0];
  return new AppError(`${field} already exists`, 409);
};

const handleMongooseValidationError = (err: MongooseError.ValidationError): AppError => {
  const messages = Object.values(err.errors).map((e: any) => e.message);
  return new AppError(messages.join('. '), 400);
};

export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction  // prefix with _ to signal intentionally unused
) => {
  // Log every error with Winston
  logger.error(`[${req.method}] ${req.path}`, err);

  // Normalize known error types into AppError
  let error: AppError;

  if (err instanceof AppError) {
    error = err;
  } else if (err instanceof MongooseError.CastError) {
    error = handleMongooseCastError(err);
  } else if ((err as any)?.code === 11000) {
    error = handleMongooseDuplicateKey(err);
  } else if (err instanceof MongooseError.ValidationError) {
    error = handleMongooseValidationError(err);
  } else {
    // Unknown/unexpected error — preserve original message in Dev for debugging
    const message = isDev ? (err as any)?.message || 'Internal Server Error' : 'Internal Server Error';
    error = new AppError(message, 500);
  }

  res.status(error.statusCode).json({
    success: false,
    status: error.statusCode,
    message: error.message,
    type: error.name, // Helpful for frontend logic
    ...(isDev && { stack: error.stack }),
  });
};
