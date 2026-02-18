// server/src/middlewares/validation.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { BadRequestError } from '../utils/error';

export const validate = (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const firstError = err.issues[0]?.message || 'Validation failed';
        // ✅ Use next() instead of throw to prevent "Unhandled Rejection"
        return next(new BadRequestError(firstError));
      }
      next(err);
    }
  };