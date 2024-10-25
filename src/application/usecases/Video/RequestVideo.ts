import { type DomainEvent } from '@/@api/domain/events/DomainEvent'
import { type Queue } from '@/@api/domain/queue/Queue'
import { inject } from '@/@api/infra/dependency-injection/Registry'
import { ImageNotFoundError } from '@/@api/infra/errors/ErrorCatalog'
import { type RequestVideoOutput } from '@/application/usecases/Video/dtos/RequestVideo.dto'
import { Batch } from '@/domain/entities/Batch'
import { type BatchRepository } from '@/domain/repositories/BatchRepository'
import { type ImageRepository } from '@/domain/repositories/ImageRepository'
import { type RequestVideoInput } from '@/infra/schemas/RequestVideoSchema'

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
