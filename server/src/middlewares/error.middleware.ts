import { Request, Response, NextFunction } from 'express'
import { AppError } from '..//utils/error'

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` })
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[ERROR] ${err.name}: ${err.message}`)

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    })
  }

  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  })
}