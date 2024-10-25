import { type ImagineVideoGateway } from '@/domain/gateways/ImagineVideoGateway'
import { GatewayNotImplemented } from '@/infra/error/ErrorCatalog'
import { LumaLabsGatewayHttp } from './LumaLabsGatewayHttp'

export class ImagineVideoGatewayFactory {
  static create (gateway: string): ImagineVideoGateway {
    if (gateway === 'LumaLabs') return new LumaLabsGatewayHttp()
    throw new GatewayNotImplemented()
  }
}
