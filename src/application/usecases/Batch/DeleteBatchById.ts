import { type DeleteBatchByIdInput } from '@/application/usecases/Batch/dtos/DeleteBatchById.dto'
import { type Image } from '@/domain/entities/Image'
import { type BatchRepository } from '@/domain/repositories/BatchRepository'
import { type ImageRepository } from '@/domain/repositories/ImageRepository'
import { type ImageStorage } from '@/domain/storage/ImageStorage'
import { inject } from '@api/infra/dependency-injection/Registry'
import { BatchNotFoundError } from '@api/infra/errors/ErrorCatalog'

export class DeleteBatchById {
  @inject('imageRepository')
  private readonly imageRepository!: ImageRepository

  @inject('batchRepository')
  private readonly batchRepository!: BatchRepository

  @inject('imageStorage')
  private readonly imageStorage!: ImageStorage

  async execute ({ id }: DeleteBatchByIdInput): Promise<void> {
    const batch = await this.batchRepository.getBatchById(id)
    if (!batch) throw new BatchNotFoundError()
    for (const imageId of batch.images) {
      const image = await this.imageRepository.getImageById(imageId) as Image
      await this.imageStorage.deleteImage(image.path)
      await this.imageRepository.deleteById(imageId)
    }
    await this.batchRepository.deleteById(batch.id)
  }
}
