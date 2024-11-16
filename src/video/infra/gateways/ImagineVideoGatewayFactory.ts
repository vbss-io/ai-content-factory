import { type ImagineVideoGateway } from '@/video/domain/gateways/ImagineVideoGateway'
import { LumaLabsGatewayHttp } from '@/video/infra/gateways/LumaLabsGatewayHttp'
import { GatewayNotImplemented } from '@api/infra/errors/ErrorCatalog'

export class ImagineVideoGatewayFactory {
  static create (gateway: string): ImagineVideoGateway {
    if (gateway === 'lumaLabs') return new LumaLabsGatewayHttp()
    throw new GatewayNotImplemented()
  }
}
