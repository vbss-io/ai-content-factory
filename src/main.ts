import 'dotenv/config'
import 'express-async-errors'

import { ImageModule } from '@/application/modules/ImageModule'
import { StatusModule } from '@/application/modules/StatusModule'
import { Registry } from '@/infra/dependency-injection/Registry'
import { ExpressErrorHandler } from '@/infra/error/ErrorHandler'
import { AxiosAdapter } from '@/infra/http/HttpClient'
import { ExpressAdapter, type HttpServer } from '@/infra/http/HttpServer'
import { LocalImageStorageAdapter } from '@/infra/storage/ImageStorage'
import { MongooseAdapter } from './infra/database/DatabaseConnection'
import { RabbitMQAdapter } from './infra/queue/Queue'

const isTestEnvironment = process.env.NODE_ENV === 'test'
let httpServer: HttpServer

async function main (): Promise<any> {
  const errorHandler = new ExpressErrorHandler()
  Registry.getInstance().provide('errorHandler', errorHandler)
  httpServer = new ExpressAdapter()
  const httpClient = new AxiosAdapter()
  const imageStorage = new LocalImageStorageAdapter()
  const queue = new RabbitMQAdapter()
  await queue.connect()
  const databaseConnection = new MongooseAdapter(String(process.env.MONGO_URI))
  await databaseConnection.connect()
  Registry.getInstance().provide('httpServer', httpServer)
  Registry.getInstance().provide('httpClient', httpClient)
  Registry.getInstance().provide('imageStorage', imageStorage)
  Registry.getInstance().provide('queue', queue)
  Registry.getInstance().provide('databaseConnection', databaseConnection)
  new StatusModule()
  new ImageModule()
  if (!isTestEnvironment) void httpServer.start(Number(process.env.PORT))
}
void main()

export { httpServer }
