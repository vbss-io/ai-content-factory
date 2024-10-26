import 'dotenv/config'
import 'express-async-errors'

import { StatusModule } from '@/@api/application/StatusModule'
import { ExpressAuthHandler } from '@/auth/infra/auth/ExpressAuthHandler'
import { PromptModule } from '@/prompt/application/PromptModule'
import { type HttpServer } from '@api/domain/http/HttpServer'
import { Registry } from '@api/infra/dependency-injection/Registry'
import { ExpressErrorHandler } from '@api/infra/errors/ErrorHandler'
import { AxiosAdapter } from '@api/infra/http/AxiosAdapter'
import { ExpressAdapter } from '@api/infra/http/ExpressAdapter'

const isTestEnvironment = process.env.NODE_ENV === 'test'
let httpServer: HttpServer

function main (): any {
  const errorHandler = new ExpressErrorHandler()
  const authHandler = new ExpressAuthHandler()
  Registry.getInstance().provide('errorHandler', errorHandler)
  Registry.getInstance().provide('authHandler', authHandler)
  httpServer = new ExpressAdapter()
  const httpClient = new AxiosAdapter()
  Registry.getInstance().provide('httpServer', httpServer)
  Registry.getInstance().provide('httpClient', httpClient)
  new StatusModule()
  new PromptModule()
  if (!isTestEnvironment) httpServer.start(Number(process.env.PORT))
}
main()

export { httpServer }
