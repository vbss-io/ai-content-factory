import { Image } from '@/domain/entities/Image'
import { type ImageRequestedData } from '@/domain/events/ImageRequested'
import { type BatchRepository } from '@/domain/repository/BatchRepository'
import { type ImageRepository } from '@/domain/repository/ImageRepository'
import { inject } from '@/infra/dependency-injection/Registry'
import { BatchNotFoundError } from '@/infra/error/ErrorCatalog'
import { type ImagineImageGateway } from '@/infra/gateways/ImagineImageGateway'
import { type ImageStorage } from '@/infra/storage/ImageStorage'

export class ProcessImage {
  @inject('batchRepository')
  private readonly batchRepository!: BatchRepository

  @inject('imagineImageGateway')
  private readonly imagineImageGateway!: ImagineImageGateway

  @inject('imageRepository')
  private readonly imageRepository!: ImageRepository

  @inject('imageStorage')
  private readonly imageStorage!: ImageStorage

  async execute (input: ImageRequestedData): Promise<void> {
    const batch = await this.batchRepository.findById(input.batchId)
    if (!batch) throw new BatchNotFoundError()
    batch.process()
    await this.batchRepository.update(batch)
    const output = await this.imagineImageGateway.imagine({
      ...batch,
      batch_size: batch.size,
      width: input.dimensions.width,
      height: input.dimensions.height,
      sampler_index: batch.sampler,
      save_images: true
    })
    batch.processUpdate({ origin: output.origin, modelName: output.model })
    for (const image of output.images) {
      const path = await this.imageStorage.uploadImage(image)
      const currentImage = Image.create({
        width: input.dimensions.width,
        height: input.dimensions.height,
        seed: Number(output.seed),
        info: output.info,
        path
      })
      const repositoryImage = await this.imageRepository.create(currentImage)
      batch.addImage(repositoryImage.id as string)
    }
    batch.finish()
    await this.batchRepository.update(batch)
  }
}
