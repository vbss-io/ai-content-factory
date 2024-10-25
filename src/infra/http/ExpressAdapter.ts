import { type AuthHandler } from '@/domain/auth/AuthHandler'
import { type Cron } from '@/domain/cron/Cron'
import { type HttpServer } from '@/domain/http/HttpServer'
import { inject } from '@/infra/dependency-injection/Registry'
import { NotFoundError } from '@/infra/errors/ErrorCatalog'
import { type ErrorHandler } from '@/infra/errors/ErrorHandler'
import cors from 'cors'
import express, { type Request, type Response } from 'express'

export class ExpressAdapter implements HttpServer {
  @inject('errorHandler')
  private readonly errorHandler!: ErrorHandler

  @inject('authHandler')
  private readonly authHandler!: AuthHandler

  @inject('cron')
  private readonly cron!: Cron

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

  async start (port?: number): Promise<any> {
    this.app.use('/*', () => {
      throw new NotFoundError()
    })
    this.app.use(this.errorHandler.handle)
    await this.cron.start()
    return this.app.listen(port)
  }
}
