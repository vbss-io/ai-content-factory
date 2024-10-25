import { type HttpServer } from '@/@api/domain/http/HttpServer'
import { HttpStatusCodes } from '@/@api/domain/http/HttpStatusCodes'
import { inject } from '@/@api/infra/dependency-injection/Registry'
import { type CheckStatus } from '@/application/usecases/Status/CheckStatus'

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
