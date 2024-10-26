import { type Batch } from '@/batch/domain/entities/Batch'
import { type BatchRepository } from '@/batch/domain/repositories/BatchRepository'
import { type GetRandomLandscapeImageOutput } from '@/image/application/usecases/dtos/GetRandomLandscapeImage.dto'
import { type ImageRepository } from '@/image/domain/repositories/ImageRepository'
import { ImageNotFoundError } from '@/image/infra/errors/ImageErrorCatalog'
import { inject } from '@api/infra/dependency-injection/Registry'

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
