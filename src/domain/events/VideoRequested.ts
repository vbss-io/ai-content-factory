import type { DomainEvent } from '@/@api/domain/events/DomainEvent'

export class VideoRequested implements DomainEvent {
  eventName = 'videoRequested'

  constructor (readonly data: VideoRequestedData) {}
}

export interface VideoRequestedData {
  batchId: string
  gateway: string
  isAutomatic?: boolean
  imageUrl: string
  dimensions: {
    width: number
    height: number
  }
}
