// server/src/middlewares/validate.ts
import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";

export interface ValidatedRequest {
  body?: any;
  query?: any;
  params?: any;
}

declare global {
  namespace Express {
    interface Request {
      validated?: ValidatedRequest;
    }
  }
}

// Fixed: Changed input type to accept { body, query, params }
const validate = (schema: {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validated: ValidatedRequest = {};

      if (schema.body) {
        validated.body = schema.body.parse(req.body);
      }

      if (schema.query) {
        validated.query = schema.query.parse(req.query);
      }

      if (schema.params) {
        validated.params = schema.params.parse(req.params);
      }

      req.validated = validated;

      return next();
    } catch (error) {
      console.error("Validation error:", error);

      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return res.status(400).json({
          message: "Validation failed",
          errors: errorMessages,
        });
      }

      return res.status(500).json({ message: "Internal validation error" });
    }
  };
};

export default validate;