import { Batch } from '@/domain/entities/Batch'
import { type DomainEvent } from '@/domain/events/DomainEvent'
import { type PromptGateway } from '@/domain/gateways/PromptGateway'
import { imagePrompt } from '@/domain/prompts/imagePrompt'
import { type Queue } from '@/domain/queue/Queue'
import { type BatchRepository } from '@/domain/repositories/BatchRepository'
import { inject } from '@/infra/dependency-injection/Registry'

export class AutomaticRequestImage {
  @inject('promptGateway')
  private readonly promptGateway!: PromptGateway

  @inject('batchRepository')
  private readonly batchRepository!: BatchRepository

  @inject('queue')
  private readonly queue!: Queue

  async execute (): Promise<void> {
    const gateways = ['goApiMidjourney', 'openAiDalle3']
    // const gateways = ['automatic1111']
    for (const gateway of gateways) {
      const promptToUse = imagePrompt.replace('replace_gateway', gateway)
      const response = await this.promptGateway.generatePrompt(promptToUse)
      let config = { size: 1, sampler: 'none', scheduler: 'none', steps: 0 }
      if (gateway === 'automatic1111') config = { size: 1, sampler: 'DPM++ 2M', scheduler: 'Karras', steps: 20 }
      const batchConfiguration = Batch.getConfigurations(gateway, { ...response, ...config })
      const batch = Batch.create({
        prompt: response.prompt,
        images: [],
        videos: [],
        ...batchConfiguration
      })
      const repositoryBatch = await this.batchRepository.create(batch)
      repositoryBatch.register('imageRequested', async (domainEvent: DomainEvent) => {
        await this.queue.publish(domainEvent.eventName, domainEvent.data)
      })
      await repositoryBatch.requestImage({ gateway, isAutomatic: true, dimensions: { width: response.width, height: response.height } })
    }
  }
}
