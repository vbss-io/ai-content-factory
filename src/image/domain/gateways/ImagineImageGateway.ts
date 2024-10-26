import { type ImagineImageInput, type ImagineImageOutput } from '@/image/domain/gateways/dtos/ImagineImageGateway.dto'

export interface ImagineImageGateway {
  imagine: (input: ImagineImageInput) => Promise<ImagineImageOutput>
}
