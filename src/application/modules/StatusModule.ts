import { StatusController } from '@/application/controllers/StatusController'
import { CheckStatus } from '@/application/usecases/Status/CheckStatus'
import { Registry } from '@api/infra/dependency-injection/Registry'

export class StatusModule {
  constructor () {
    const checkStatus = new CheckStatus()
    Registry.getInstance().provide('checkStatus', checkStatus)
    new StatusController()
  }
}
