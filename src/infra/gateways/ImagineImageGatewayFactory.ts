import { type ImagineImageGateway } from '@/domain/gateways/ImagineImageGateway'
import { GatewayNotImplemented } from '@/infra/error/ErrorCatalog'
import { Automatic1111GatewayHttp } from '@/infra/gateways/Automatic1111GatewayHttp'
import { GoAPIMidjourneyGatewayHttp } from './GoAPIMidjourneyGatewayHttp'

export class ImagineImageGatewayFactory {
  static create (gateway: string): ImagineImageGateway {
    if (gateway === 'automatic1111') return new Automatic1111GatewayHttp()
    if (gateway === 'goApiMidjourney') return new GoAPIMidjourneyGatewayHttp()
    throw new GatewayNotImplemented()
  }
}
