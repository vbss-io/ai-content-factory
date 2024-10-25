import { type ImagineVideoInput, type ImagineVideoOutput } from '@/domain/gateways/dto/ImagineVideoGateway.dto'

export interface ImagineVideoGateway {
  imagine: (input: ImagineVideoInput) => Promise<ImagineVideoOutput>
}
