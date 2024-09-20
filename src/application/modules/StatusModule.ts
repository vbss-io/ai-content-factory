import { StatusController } from '@/application/controllers/StatusController'
import { CheckStatus } from '@/application/usecases/CheckStatus'
import { Registry } from '@/infra/dependency-injection/Registry'

export class StatusModule {
  constructor () {
    const checkStatus = new CheckStatus()
    Registry.getInstance().provide('checkStatus', checkStatus)
    new StatusController()
  }
}
