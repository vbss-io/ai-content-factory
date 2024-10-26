import { type CheckStatusOutput } from '@api/application/usecases/dtos/CheckStatus.dto'

export class CheckStatus {
  async execute (): Promise<CheckStatusOutput> {
    return { status: 'OK' }
  }
}
