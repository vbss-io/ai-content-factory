import 'dotenv/config'
import 'express-async-errors'

import { BatchModule } from '@/application/modules/BatchModule'
import { ImageModule } from '@/application/modules/ImageModule'
import { PromptModule } from '@/application/modules/PromptModule'
import { StatusModule } from '@/application/modules/StatusModule'
import { UserModule } from '@/application/modules/UserModule'
import { ExpressAuthHandler } from '@/infra/auth/AuthHandler'
import { JWTAdapter } from '@/infra/auth/TokenAuthentication'
import { CronAdapter } from '@/infra/cron/Cron'
import { MongooseAdapter } from '@/infra/database/DatabaseConnection'
import { Registry } from '@/infra/dependency-injection/Registry'
import { ExpressErrorHandler } from '@/infra/error/ErrorHandler'
import { AxiosAdapter } from '@/infra/http/HttpClient'
import { ExpressAdapter, type HttpServer } from '@/infra/http/HttpServer'
import { InMemoryQueueAdapter } from '@/infra/queue/Queue'
import { AzureStorageAdapter } from '@/infra/storage/ImageStorage'

const isTestEnvironment = process.env.NODE_ENV === 'test'
let httpServer: HttpServer

async function main (): Promise<any> {
  const errorHandler = new ExpressErrorHandler()
  const tokenAuthentication = new JWTAdapter()
  const authHandler = new ExpressAuthHandler()
  Registry.getInstance().provide('tokenAuthentication', tokenAuthentication)
  Registry.getInstance().provide('errorHandler', errorHandler)
  Registry.getInstance().provide('authHandler', authHandler)
  httpServer = new ExpressAdapter()
  const httpClient = new AxiosAdapter()
  const imageStorage = new AzureStorageAdapter()
  const queue = new InMemoryQueueAdapter()
  await queue.connect()
  const databaseConnection = new MongooseAdapter(String(process.env.MONGO_URI))
  await databaseConnection.connect()
  const cron = new CronAdapter()
  Registry.getInstance().provide('httpServer', httpServer)
  Registry.getInstance().provide('httpClient', httpClient)
  Registry.getInstance().provide('imageStorage', imageStorage)
  Registry.getInstance().provide('queue', queue)
  Registry.getInstance().provide('databaseConnection', databaseConnection)
  Registry.getInstance().provide('cron', cron)
  new StatusModule()
  new UserModule()
  new BatchModule()
  new ImageModule()
  new PromptModule()
  if (!isTestEnvironment) void httpServer.start(Number(process.env.PORT))
}
void main()

export { httpServer }

