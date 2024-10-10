import { type RequestImageOutput } from '@/application/usecases/dto/RequestImage.dto'
import { Batch } from '@/domain/entities/Batch'
import { type DomainEvent } from '@/domain/events/DomainEvent'
import { type BatchRepository } from '@/domain/repository/BatchRepository'
import { inject } from '@/infra/dependency-injection/Registry'
import { type Queue } from '@/infra/queue/Queue'
import { type RequestImageInput } from '@/infra/schemas/RequestImageSchema'

export class RequestImage {
  @inject('batchRepository')
  private readonly batchRepository!: BatchRepository

  @inject('queue')
  private readonly queue!: Queue

  async execute (input: RequestImageInput): Promise<RequestImageOutput> {
    const inputConfiguration = { ...input, sampler: input.sampler_index, size: input.batch_size, negativePrompt: input.negative_prompt }
    const batchConfiguration = Batch.getConfigurations(input.gateway, inputConfiguration)
    const batch = Batch.create({
      prompt: input.prompt,
      images: [],
      ...batchConfiguration
    })
    const repositoryBatch = await this.batchRepository.create(batch)
    repositoryBatch.register('imageRequested', async (domainEvent: DomainEvent) => {
      await this.queue.publish(domainEvent.eventName, domainEvent.data)
    })
    await repositoryBatch.request({ gateway: input.gateway, dimensions: { width: input.width, height: input.height } })
    return {
      batchId: repositoryBatch.id,
      batchStatus: batch.status
    }
  }
}
