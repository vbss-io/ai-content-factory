import { type DeleteImageByIdInput } from '@/application/usecases/dto/DeleteImageById.dto'
import { type BatchRepository } from '@/domain/repository/BatchRepository'
import { type ImageRepository } from '@/domain/repository/ImageRepository'
import { inject } from '@/infra/dependency-injection/Registry'
import { ImageNotFoundError } from '@/infra/error/ErrorCatalog'
import { type ImageStorage } from '@/infra/storage/ImageStorage'

export class DeleteImageById {
  @inject('imageRepository')
  private readonly imageRepository!: ImageRepository

  @inject('batchRepository')
  private readonly batchRepository!: BatchRepository

  @inject('imageStorage')
  private readonly imageStorage!: ImageStorage

  async execute ({ id }: DeleteImageByIdInput): Promise<void> {
    const image = await this.imageRepository.getImageById(id)
    if (!image) throw new ImageNotFoundError()
    // const batch = await this.batchRepository.getBatchById(image.batchId) as Batch
    // batch?.removeImage(id)
    // if (!batch?.images.length) {
    //   await this.batchRepository.deleteById(batch?.id)
    // } else {
    //   await this.batchRepository.update(batch)
    // }
    // await this.imageRepository.deleteById(id)
    await this.imageStorage.deleteImage(image.path)
  }
}
