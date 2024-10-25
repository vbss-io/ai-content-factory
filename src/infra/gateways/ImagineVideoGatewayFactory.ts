import { type ImagineVideoGateway } from '@/domain/gateways/ImagineVideoGateway'
import { GatewayNotImplemented } from '@/infra/errors/ErrorCatalog'
import { LumaLabsGatewayHttp } from '@/infra/gateways/video/LumaLabsGatewayHttp'

export class ImagineVideoGatewayFactory {
  static create (gateway: string): ImagineVideoGateway {
    if (gateway === 'LumaLabs') return new LumaLabsGatewayHttp()
    throw new GatewayNotImplemented()
  }
}
