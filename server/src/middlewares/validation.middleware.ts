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
        const messages = err.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        // Throws only the first validation error (matching your original behavior)
        throw new BadRequestError(
          messages[0]?.message || 'Validation failed'
        );
      }

      // Re-throw any other unexpected errors
      throw err;
    }
  };