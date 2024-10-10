import { type ImagineInput, type ImagineOutput } from '@/domain/gateways/dto/ImagineImageGateway.dto'

export interface ImagineImageGateway {
  imagine: (input: ImagineInput) => Promise<ImagineOutput>
}
