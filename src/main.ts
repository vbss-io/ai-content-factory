import 'dotenv/config'
import 'express-async-errors'

import { CronJobModule } from '@/@cron/application/CronJobModule'
import { AuthModule } from '@/auth/application/AuthModule'
import { ExpressAuthHandler } from '@/auth/infra/auth/ExpressAuthHandler'
import { BatchModule } from '@/batch/application/BatchModule'
import { ImageModule } from '@/image/application/ImageModule'
import { PromptModule } from '@/prompt/application/PromptModule'
import { UserModule } from '@/user/application/UserModule'
import { VideoModule } from '@/video/application/VideoModule'
import { StatusModule } from '@api/application/StatusModule'
import { MongooseAdapter } from '@api/infra/database/MongooseAdapter'
import { Registry } from '@api/infra/dependency-injection/Registry'
import { ExpressErrorHandler } from '@api/infra/errors/ErrorHandler'
import { AxiosAdapter } from '@api/infra/http/AxiosAdapter'
import { ExpressAdapter } from '@api/infra/http/ExpressAdapter'
import { InMemoryQueueAdapter } from '@api/infra/queue/InMemoryQueueAdapter'

function main (): any {
  const errorHandler = new ExpressErrorHandler()
  const authHandler = new ExpressAuthHandler()
  Registry.getInstance().provide('errorHandler', errorHandler)
  Registry.getInstance().provide('authHandler', authHandler)
  const httpServer = new ExpressAdapter()
  const httpClient = new AxiosAdapter()
  const queue = new InMemoryQueueAdapter()
  void queue.connect()
  const databaseConnection = new MongooseAdapter(String(process.env.MONGO_URI))
  void databaseConnection.connect()
  Registry.getInstance().provide('httpServer', httpServer)
  Registry.getInstance().provide('httpClient', httpClient)
  Registry.getInstance().provide('queue', queue)
  Registry.getInstance().provide('databaseConnection', databaseConnection)
  new StatusModule()
  new UserModule()
  new AuthModule()
  new BatchModule()
  new PromptModule()
  new ImageModule()
  new VideoModule()
  new CronJobModule()
  httpServer.start(Number(process.env.PORT))
}
main()
