import type { DomainEvent } from '@api/domain/events/DomainEvent'

export class ImageRequested implements DomainEvent {
  eventName = 'imageRequested'

  constructor (readonly data: ImageRequestedData) {}
}

export interface ImageRequestedData {
  batchId: string
  gateway: string
  isAutomatic?: boolean
  dimensions: {
    width: number
    height: number
  }
}
