import { Batch } from '@/domain/entities/Batch'
import { type DomainEvent } from '@/domain/events/DomainEvent'
import { type BatchRepository } from '@/domain/repository/BatchRepository'
import { type ImageRepository } from '@/domain/repository/ImageRepository'
import { inject } from '@/infra/dependency-injection/Registry'
import { ImageNotFoundError } from '@/infra/error/ErrorCatalog'
import { type Queue } from '@/infra/queue/Queue'
import { type RequestVideoInput } from '@/infra/schemas/RequestVideoSchema'
import { type RequestVideoOutput } from './dto/RequestVideo.dto'

export class RequestVideo {
  @inject('batchRepository')
  private readonly batchRepository!: BatchRepository

  @inject('imageRepository')
  private readonly imageRepository!: ImageRepository

  @inject('queue')
  private readonly queue!: Queue

  async execute (input: RequestVideoInput): Promise<RequestVideoOutput> {
    let imageUrl: string = ''
    if (input.imageId) {
      const image = await this.imageRepository.getImageById(input.imageId)
      if (!image) throw new ImageNotFoundError()
      imageUrl = `${process.env.FILES_STORAGE}${image?.path}`
    }
    const batchConfiguration = Batch.getConfigurations(input.gateway)
    const batch = Batch.create({
      prompt: input.prompt,
      images: [],
      videos: [],
      type: 'video',
      ...batchConfiguration
    })
    const repositoryBatch = await this.batchRepository.create(batch)
    repositoryBatch.register('videoRequested', async (domainEvent: DomainEvent) => {
      await this.queue.publish(domainEvent.eventName, domainEvent.data)
    })
    await repositoryBatch.requestVideo({ gateway: input.gateway, dimensions: { width: input.width, height: input.height }, imageUrl })
    return {
      batchId: repositoryBatch.id,
      batchStatus: batch.status
    }
  }
}
