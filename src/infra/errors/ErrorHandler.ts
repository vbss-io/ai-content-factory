import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'

import { HttpStatusCodes } from '@/domain/http/HttpStatusCodes'
import { CustomError } from '@/infra/errors/CustomError'

export interface ErrorHandler {
  handle: (err: Error, req: any, res: any, next: any) => any
}

export class ExpressErrorHandler implements ErrorHandler {
  handle (err: Error, _req: Request, res: Response, _next: NextFunction): Response {
    if (err instanceof ZodError) {
      return res.status(HttpStatusCodes.BadRequest).json({ message: err.errors[0].message })
    }
    if (err instanceof CustomError) {
      return res.status(err.statusCode).json({ message: err.message })
    }
    return res.status(HttpStatusCodes.InternalServerError).json({ message: 'Internal Server Error' })
  }
}
