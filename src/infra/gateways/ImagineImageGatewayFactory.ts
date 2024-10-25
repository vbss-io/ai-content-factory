import { GatewayNotImplemented } from '@/@api/infra/errors/ErrorCatalog'
import { type ImagineImageGateway } from '@/domain/gateways/ImagineImageGateway'
import { Automatic1111GatewayHttp } from '@/infra/gateways/image/Automatic1111GatewayHttp'
import { GoAPIMidjourneyGatewayHttp } from '@/infra/gateways/image/GoAPIMidjourneyGatewayHttp'
import { OpenAIDalle3GatewayHttp } from '@/infra/gateways/image/OpenApiDalle3GatewayHttp'

export class ImagineImageGatewayFactory {
  static create (gateway: string): ImagineImageGateway {
    if (gateway === 'automatic1111') return new Automatic1111GatewayHttp()
    if (gateway === 'goApiMidjourney') return new GoAPIMidjourneyGatewayHttp()
    if (gateway === 'openAiDalle3') return new OpenAIDalle3GatewayHttp()
    throw new GatewayNotImplemented()
  }
}
