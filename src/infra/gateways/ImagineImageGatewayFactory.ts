import { type ImagineImageGateway } from '@/domain/gateways/ImagineImageGateway'
import { GatewayNotImplemented } from '@/infra/error/ErrorCatalog'
import { Automatic1111GatewayHttp } from '@/infra/gateways/Automatic1111GatewayHttp'
import { GoAPIMidjourneyGatewayHttp } from '@/infra/gateways/GoAPIMidjourneyGatewayHttp'
import { OpenAIDalle3GatewayHttp } from '@/infra/gateways/OpenApiDalle3GatewayHttp'

export class ImagineImageGatewayFactory {
  static create (gateway: string): ImagineImageGateway {
    if (gateway === 'automatic1111') return new Automatic1111GatewayHttp()
    if (gateway === 'goApiMidjourney') return new GoAPIMidjourneyGatewayHttp()
    if (gateway === 'openAiDalle3') return new OpenAIDalle3GatewayHttp()
    throw new GatewayNotImplemented()
  }
}
