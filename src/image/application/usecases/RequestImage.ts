import { Batch } from '@/batch/domain/entities/Batch'
import { type BatchRepository } from '@/batch/domain/repositories/BatchRepository'
import { type RequestImageInput, type RequestImageOutput } from '@/image/application/usecases/dtos/RequestImage.dto'
import { type DomainEvent } from '@api/domain/events/DomainEvent'
import { type Queue } from '@api/domain/queue/Queue'
import { inject } from '@api/infra/dependency-injection/Registry'

export class RequestImage {
  @inject('batchRepository')
  private readonly batchRepository!: BatchRepository

  @inject('queue')
  private readonly queue!: Queue

  async execute (input: RequestImageInput): Promise<RequestImageOutput> {
    const inputConfiguration = { ...input, sampler: input.sampler_index, size: input.batch_size, negativePrompt: input.negative_prompt }
    const batchConfiguration = Batch.configurationFactory(inputConfiguration)
    const batch = Batch.create({
      prompt: input.prompt,
      author: input.author,
      automatic: false,
      ...batchConfiguration
    })
    const repositoryBatch = await this.batchRepository.create(batch)
    repositoryBatch.register('imageRequested', async (domainEvent: DomainEvent) => {
      await this.queue.publish(domainEvent.eventName, domainEvent.data)
    })
    await repositoryBatch.requestImage({ gateway: input.gateway, aspectRatio: input.aspectRatio })
    return {
      batchId: repositoryBatch.id,
      batchStatus: batch.status
    }
  }
}
