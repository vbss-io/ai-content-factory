import { type ImagineVideoInput, type ImagineVideoOutput } from '@/domain/gateways/dtos/ImagineVideoGateway.dto'

export interface ImagineVideoGateway {
  imagine: (input: ImagineVideoInput) => Promise<ImagineVideoOutput>
}
