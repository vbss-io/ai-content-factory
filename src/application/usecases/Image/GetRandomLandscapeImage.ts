import { type GetRandomLandscapeImageOutput } from '@/application/usecases/Image/dtos/GetRandomLandscapeImage.dto'
import { type Batch } from '@/domain/entities/Batch'
import { type BatchRepository } from '@/domain/repositories/BatchRepository'
import { type ImageRepository } from '@/domain/repositories/ImageRepository'
import { inject } from '@/infra/dependency-injection/Registry'
import { ImageNotFoundError } from '@/infra/errors/ErrorCatalog'

export class GetRandomLandscapeImage {
  @inject('imageRepository')
  private readonly imageRepository!: ImageRepository

  @inject('batchRepository')
  private readonly batchRepository!: BatchRepository

  async execute (): Promise<GetRandomLandscapeImageOutput> {
    const image = await this.imageRepository.getRandomLandscapeImage()
    if (!image) throw new ImageNotFoundError()
    const batch = await this.batchRepository.getBatchById(image.batchId) as Batch
    return {
      ...image,
      prompt: batch.prompt,
      negativePrompt: batch.negativePrompt,
      sampler: batch.sampler,
      scheduler: batch.scheduler,
      steps: batch.steps,
      origin: batch.origin,
      modelName: batch.modelName
    }
  }
}
