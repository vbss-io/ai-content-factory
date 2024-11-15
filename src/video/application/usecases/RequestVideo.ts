import { Batch } from '@/batch/domain/entities/Batch'
import { type BatchRepository } from '@/batch/domain/repositories/BatchRepository'
import { type ImageRepository } from '@/image/domain/repositories/ImageRepository'
import { ImageNotFoundError } from '@/image/infra/errors/ImageErrorCatalog'
import { type RequestVideoInput, type RequestVideoOutput } from '@/video/application/usecases/dtos/RequestVideo.dto'
import { type DomainEvent } from '@api/domain/events/DomainEvent'
import { type Queue } from '@api/domain/queue/Queue'
import { inject } from '@api/infra/dependency-injection/Registry'

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
      author: input.author,
      automatic: false,
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
