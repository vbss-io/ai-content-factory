import { StatusController } from '@/@api/application/controller/StatusController'
import { CheckStatus } from '@api/application/usecases/CheckStatus'
import { Registry } from '@api/infra/dependency-injection/Registry'

export class StatusModule {
  constructor () {
    const checkStatus = new CheckStatus()
    Registry.getInstance().provide('checkStatus', checkStatus)
    new StatusController()
  }
}
