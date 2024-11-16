import { Batch } from '@/batch/domain/entities/Batch'
import { type BatchRepository } from '@/batch/domain/repositories/BatchRepository'
import { imagePrompt } from '@/image/domain/constansts/imagePrompt'
import { type PromptGateway } from '@/prompt/domain/gateways/PromptGateway'
import { type DomainEvent } from '@api/domain/events/DomainEvent'
import { type Queue } from '@api/domain/queue/Queue'
import { inject } from '@api/infra/dependency-injection/Registry'

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
      const batchConfiguration = Batch.configurationFactory({ ...response, ...config, gateway })
      const batch = Batch.create({
        prompt: response.prompt,
        automatic: true,
        author: '6706fd7b8b0360f2b82c3c18',
        ...batchConfiguration
      })
      const repositoryBatch = await this.batchRepository.create(batch)
      repositoryBatch.register('imageRequested', async (domainEvent: DomainEvent) => {
        await this.queue.publish(domainEvent.eventName, domainEvent.data)
      })
      await repositoryBatch.requestImage({ gateway, isAutomatic: true, aspectRatio: response.aspectRatio })
    }
  }
}
