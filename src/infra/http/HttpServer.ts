import { inject } from '@/infra/dependency-injection/Registry'
import { NotFoundError } from '@/infra/error/ErrorCatalog'
import type { ErrorHandler } from '@/infra/error/ErrorHandler'
import cors from 'cors'
import express, { type Request, type Response } from 'express'

export interface HttpServer {
  register: (method: string, url: string, callback: any, code?: number) => void
  start: (port?: number) => any
}

export class ExpressAdapter implements HttpServer {
  @inject('errorHandler')
  private readonly errorHandler!: ErrorHandler

  app: any

  constructor () {
    this.app = express()
    this.app.use(cors())
    this.app.use(express.json())
  }

  register (method: string, url: string, callback: any, code = 200): void {
    this.app[method](url, async (req: Request, res: Response) => {
      const output = await callback(
        { ...req.params, ...req.query, ...req.body },
        req.headers
      )
      res.status(code).json(output)
    })
  }

  start (port?: number): any {
    this.app.use('/*', () => {
      throw new NotFoundError()
    })
    this.app.use(this.errorHandler.handle)
    return this.app.listen(port)
  }
}