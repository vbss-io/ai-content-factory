import { type ImagineImageGateway } from '@/image/domain/gateways/ImagineImageGateway'
import { Automatic1111GatewayHttp } from '@/image/infra/gateways/Automatic1111GatewayHttp'
import { GoAPIMidjourneyGatewayHttp } from '@/image/infra/gateways/GoAPIMidjourneyGatewayHttp'
import { OpenAIDalle3GatewayHttp } from '@/image/infra/gateways/OpenApiDalle3GatewayHttp'
import { GatewayNotImplemented } from '@api/infra/errors/ErrorCatalog'

export class ImagineImageGatewayFactory {
  static create (gateway: string): ImagineImageGateway {
    if (gateway === 'automatic1111') return new Automatic1111GatewayHttp()
    if (gateway === 'goApiMidjourney') return new GoAPIMidjourneyGatewayHttp()
    if (gateway === 'openAiDalle3') return new OpenAIDalle3GatewayHttp()
    throw new GatewayNotImplemented()
  }
}
