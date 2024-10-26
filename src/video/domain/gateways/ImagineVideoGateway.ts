import { type ImagineVideoInput, type ImagineVideoOutput } from '@/video/domain/gateways/dtos/ImagineVideoGateway.dto'

export interface ImagineVideoGateway {
  imagine: (input: ImagineVideoInput) => Promise<ImagineVideoOutput>
}
