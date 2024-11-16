import type { DomainEvent } from '@api/domain/events/DomainEvent'

export class ImageRequested implements DomainEvent {
  eventName = 'imageRequested'

  constructor (readonly data: ImageRequestedData) {}
}

export interface ImageRequestedData {
  batchId: string
  gateway: string
  aspectRatio: string
  isAutomatic?: boolean
}
