import { type CheckStatusOutput } from '@/application/usecases/Status/dto/CheckStatus.dto'

export class CheckStatus {
  async execute (): Promise<CheckStatusOutput> {
    return { status: 'OK' }
  }
}
