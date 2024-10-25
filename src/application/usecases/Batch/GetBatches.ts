import { type GetBatchesInput, type GetBatchesOutput } from '@/application/usecases/Batch/dtos/GetBatches.dto'
import { type BatchRepository } from '@/domain/repositories/BatchRepository'
import { type ImageRepository } from '@/domain/repositories/ImageRepository'
import { inject } from '@api/infra/dependency-injection/Registry'

export class GetBatches {
  @inject('batchRepository')
  private readonly batchRepository!: BatchRepository

  @inject('imageRepository')
  private readonly imageRepository!: ImageRepository

  async execute ({ search_mask, sampler, scheduler, status, origin, modelName, page }: GetBatchesInput): Promise<GetBatchesOutput> {
    const output: GetBatchesOutput = []
    const batches = await this.batchRepository.getBatches(page, search_mask, sampler, scheduler, status, origin, modelName)
    for (const batch of batches) {
      const images = await this.imageRepository.getImagesByIds(batch.images)
      const imagesPaths = images.map((image) => image.path)
      output.push({ ...batch, images: imagesPaths })
    }
    return output
  }
}
