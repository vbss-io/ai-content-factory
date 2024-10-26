import { type CheckStatus } from '@api/application/usecases/CheckStatus'
import { type HttpServer } from '@api/domain/http/HttpServer'
import { HttpStatusCodes } from '@api/domain/http/HttpStatusCodes'
import { inject } from '@api/infra/dependency-injection/Registry'

export class StatusController {
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
