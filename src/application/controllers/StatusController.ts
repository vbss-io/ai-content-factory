import { type CheckStatus } from '@/application/usecases/CheckStatus'
import { inject } from '@/infra/dependency-injection/Registry'
import type { HttpServer } from '@/infra/http/HttpServer'
import { HttpStatusCodes } from '@/infra/http/HttpStatusCodes'

export class ChatController {
  @inject('httpServer')
  private readonly httpServer!: HttpServer

  @inject('checkStatus')
  private readonly checkStatus!: CheckStatus

  constructor () {
    this.httpServer.register('get', '/status', async () => {
      return await this.checkStatus.execute()
    }, HttpStatusCodes.OK)
  }
}
