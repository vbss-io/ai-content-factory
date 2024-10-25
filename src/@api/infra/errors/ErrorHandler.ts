import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'

import { type ErrorHandler } from '@api/domain/errors/ErrorHandler'
import { HttpStatusCodes } from '@api/domain/http/HttpStatusCodes'
import { CustomError } from '@api/infra/errors/CustomError'

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
