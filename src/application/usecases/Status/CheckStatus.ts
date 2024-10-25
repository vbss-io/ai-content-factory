import { type CheckStatusOutput } from '@/application/usecases/Status/dtos/CheckStatus.dto'

export class CheckStatus {
  async execute (): Promise<CheckStatusOutput> {
    return { status: 'OK' }
  }
}
