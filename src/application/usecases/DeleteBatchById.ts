import { type Image } from '@/domain/entities/Image'
import { type BatchRepository } from '@/domain/repository/BatchRepository'
import { type ImageRepository } from '@/domain/repository/ImageRepository'
import { inject } from '@/infra/dependency-injection/Registry'
import { BatchNotFoundError } from '@/infra/error/ErrorCatalog'
import { type ImageStorage } from '@/infra/storage/ImageStorage'
import { type DeleteBatchByIdInput } from './dto/DeleteBatchById.dto'

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
