import { type CheckStatusOutput } from './dto/CheckStatus.dto'

export class CheckStatus {
  async execute (): Promise<CheckStatusOutput> {
    return { status: 'OK' }
  }
}
