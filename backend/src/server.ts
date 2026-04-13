import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { errorMiddleware, AppError } from './shared/middleware/errorMiddleware';
import asyncHandler from './shared/asyncHandler';

// Load env vars
dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Connect to Database
connectDB();

// Test Route
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running...' });
});

// Example Async Route with error
app.get('/test-error', asyncHandler(async (req: Request, res: Response) => {
  throw new AppError('This is a test async error', 400);
}));

// Global Error Handler
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
