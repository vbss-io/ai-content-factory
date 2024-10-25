import 'dotenv/config'
import 'express-async-errors'

import { BatchModule } from '@/application/modules/BatchModule'
import { ImageModule } from '@/application/modules/ImageModule'
import { PromptModule } from '@/application/modules/PromptModule'
import { StatusModule } from '@/application/modules/StatusModule'
import { UserModule } from '@/application/modules/UserModule'
import { VideoModule } from '@/application/modules/VideoModule'
import { ExpressAuthHandler } from '@/infra/auth/ExpressAuthHandler'
import { JWTAdapter } from '@/infra/auth/JWTAdapter'
import { RequestFacade } from '@/infra/facades/RequestFacade'
import { AzureImageStorageAdapter } from '@/infra/storage/AzureImageStorageAdapter'
import { AzureVideoStorageAdapter } from '@/infra/storage/AzureVideoStorageAdapter'
import { type HttpServer } from '@api/domain/http/HttpServer'
import { CronAdapter } from '@api/infra/cron/CronAdapter'
import { MongooseAdapter } from '@api/infra/database/MongooseAdapter'
import { Registry } from '@api/infra/dependency-injection/Registry'
import { ExpressErrorHandler } from '@api/infra/errors/ErrorHandler'
import { AxiosAdapter } from '@api/infra/http/AxiosAdapter'
import { ExpressAdapter } from '@api/infra/http/ExpressAdapter'
import { InMemoryQueueAdapter } from '@api/infra/queue/InMemoryQueueAdapter'

const isTestEnvironment = process.env.NODE_ENV === 'test'
let httpServer: HttpServer

async function main (): Promise<any> {
  const errorHandler = new ExpressErrorHandler()
  const tokenAuthentication = new JWTAdapter()
  const authHandler = new ExpressAuthHandler()
  const requestFacade = new RequestFacade()
  Registry.getInstance().provide('tokenAuthentication', tokenAuthentication)
  Registry.getInstance().provide('errorHandler', errorHandler)
  Registry.getInstance().provide('authHandler', authHandler)
  Registry.getInstance().provide('requestFacade', requestFacade)
  httpServer = new ExpressAdapter()
  const httpClient = new AxiosAdapter()
  const imageStorage = new AzureImageStorageAdapter()
  const videoStorage = new AzureVideoStorageAdapter()
  const queue = new InMemoryQueueAdapter()
  await queue.connect()
  const databaseConnection = new MongooseAdapter(String(process.env.MONGO_URI))
  await databaseConnection.connect()
  const cron = new CronAdapter()
  Registry.getInstance().provide('httpServer', httpServer)
  Registry.getInstance().provide('httpClient', httpClient)
  Registry.getInstance().provide('imageStorage', imageStorage)
  Registry.getInstance().provide('videoStorage', videoStorage)
  Registry.getInstance().provide('queue', queue)
  Registry.getInstance().provide('databaseConnection', databaseConnection)
  Registry.getInstance().provide('cron', cron)
  new StatusModule()
  new UserModule()
  new BatchModule()
  new PromptModule()
  new ImageModule()
  new VideoModule()
  if (!isTestEnvironment) void httpServer.start(Number(process.env.PORT))
}
void main()

export { httpServer }

