import 'dotenv/config'
import 'express-async-errors'

import { Registry } from '@/infra/dependency-injection/Registry'
import { ExpressErrorHandler } from '@/infra/error/ErrorHandler'
import { ExpressAdapter, type HttpServer } from '@/infra/http/HttpServer'
import { StatusModule } from './application/modules/StatusModule'

const isTestEnvironment = process.env.NODE_ENV === 'test'
let httpServer: HttpServer

function main (): any {
  const errorHandler = new ExpressErrorHandler()
  Registry.getInstance().provide('errorHandler', errorHandler)
  httpServer = new ExpressAdapter()
  Registry.getInstance().provide('httpServer', httpServer)
  new StatusModule()
  if (!isTestEnvironment) httpServer.start(Number(process.env.PORT))
}
main()

export { httpServer }
