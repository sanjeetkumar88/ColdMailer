import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';
import { asyncHandler } from '../utils/asyncHandler';

export const validate = (schema: ZodTypeAny) => 
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  });
