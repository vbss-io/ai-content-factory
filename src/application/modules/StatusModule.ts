import { Registry } from '@/@api/infra/dependency-injection/Registry'
import { StatusController } from '@/application/controllers/StatusController'
import { CheckStatus } from '@/application/usecases/Status/CheckStatus'

export class StatusModule {
  constructor () {
    const checkStatus = new CheckStatus()
    Registry.getInstance().provide('checkStatus', checkStatus)
    new StatusController()
  }
}
