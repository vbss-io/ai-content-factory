import type { DomainEvent } from '@/domain/events/DomainEvent'

export class ImageRequested implements DomainEvent {
  eventName = 'imageRequested'

  constructor (readonly data: ImageRequestedData) {}
}

export interface ImageRequestedData {
  batchId: string
  gateway: string
  dimensions: {
    width: number
    height: number
  }
}
