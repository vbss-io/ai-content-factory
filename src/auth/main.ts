import 'dotenv/config'
import 'express-async-errors'

import { AuthModule } from '@/auth/application/AuthModule'
import { ExpressAuthHandler } from '@/auth/infra/auth/ExpressAuthHandler'
import { UserModule } from '@/user/application/UserModule'
import { StatusModule } from '@api/application/StatusModule'
import { type DatabaseConnection } from '@api/domain/database/DatabaseConnection'
import { type HttpServer } from '@api/domain/http/HttpServer'
import { MongooseAdapter } from '@api/infra/database/MongooseAdapter'
import { Registry } from '@api/infra/dependency-injection/Registry'
import { ExpressErrorHandler } from '@api/infra/errors/ErrorHandler'
import { AxiosAdapter } from '@api/infra/http/AxiosAdapter'
import { ExpressAdapter } from '@api/infra/http/ExpressAdapter'

const isTestEnvironment = process.env.NODE_ENV === 'test'
let httpServer: HttpServer
let databaseConnection: DatabaseConnection

function main (): any {
  const errorHandler = new ExpressErrorHandler()
  const authHandler = new ExpressAuthHandler()
  Registry.getInstance().provide('errorHandler', errorHandler)
  Registry.getInstance().provide('authHandler', authHandler)
  httpServer = new ExpressAdapter()
  const httpClient = new AxiosAdapter()
  databaseConnection = new MongooseAdapter(String(process.env.MONGO_URI))
  void databaseConnection.connect()
  Registry.getInstance().provide('httpServer', httpServer)
  Registry.getInstance().provide('httpClient', httpClient)
  Registry.getInstance().provide('databaseConnection', databaseConnection)
  new StatusModule()
  new UserModule()
  new AuthModule()
  if (!isTestEnvironment) void httpServer.start(Number(process.env.PORT))
}
main()

export { databaseConnection, httpServer }
