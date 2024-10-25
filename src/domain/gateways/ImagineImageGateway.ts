import { type ImagineImageInput, type ImagineImageOutput } from '@/domain/gateways/dtos/ImagineImageGateway.dto'

export interface ImagineImageGateway {
  imagine: (input: ImagineImageInput) => Promise<ImagineImageOutput>
}
