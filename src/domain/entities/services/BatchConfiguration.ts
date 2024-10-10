import { GatewayNotImplemented } from '@/infra/error/ErrorCatalog'

export class BatchConfigurationFactory {
  readonly gateways = ['automatic1111', 'goApiMidjourney']
  isAutomatic1111: boolean
  isGoApiMidjourney: boolean

  constructor (gateway: string) {
    if (!this.gateways.includes(gateway)) {
      throw new GatewayNotImplemented()
    }
    this.isAutomatic1111 = gateway === 'automatic1111'
    this.isGoApiMidjourney = gateway === 'midjourney'
  }

  getSampler (sampler: string): string {
    if (this.isAutomatic1111) return sampler
    return 'none'
  }

  getScheduler (scheduler: string): string {
    if (this.isAutomatic1111) return scheduler
    return 'none'
  }

  getSteps (steps: number): number {
    if (this.isAutomatic1111) return steps
    return 0
  }

  getSize (size: number): number {
    if (this.isAutomatic1111) return size
    if (this.isGoApiMidjourney) return 4
    return 0
  }

  getNegativePrompt (negativePrompt?: string): string {
    if (!negativePrompt || !this.isAutomatic1111) return 'none'
    return negativePrompt
  }

  getEventName (): string {
    if (this.isAutomatic1111) return 'stableDiffusionImageRequested'
    if (this.isGoApiMidjourney) return 'midjourneyImageRequested'
    throw new GatewayNotImplemented()
  }
}
