import { type AuthHandler } from '@/auth/domain/auth/AuthHandler'
import { type ErrorHandler } from '@api/domain/errors/ErrorHandler'
import { type HttpServer } from '@api/domain/http/HttpServer'
import { inject } from '@api/infra/dependency-injection/Registry'
import { NotFoundError } from '@api/infra/errors/ErrorCatalog'
import cors from 'cors'
import express, { type Request, type Response } from 'express'

export class ExpressAdapter implements HttpServer {
  @inject('errorHandler')
  private readonly errorHandler!: ErrorHandler

  @inject('authHandler')
  private readonly authHandler!: AuthHandler

  app: any

  constructor () {
    this.app = express()
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use(this.authHandler.handle.bind(this.authHandler))
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
    this.app.use('/*', () => { throw new NotFoundError() })
    this.app.use(this.errorHandler.handle)
    return this.app.listen(port)
  }
}
