import { type ImagineImageInput, type ImagineImageOutput } from '@/domain/gateways/dto/ImagineImageGateway.dto'

export interface ImagineImageGateway {
  imagine: (input: ImagineImageInput) => Promise<ImagineImageOutput>
}
