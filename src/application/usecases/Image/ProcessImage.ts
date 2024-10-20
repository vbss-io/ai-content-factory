import { type ProcessImageInput } from '@/application/usecases/Image/dto/ProcessImage.dto'
import { Image } from '@/domain/entities/Image'
import { type BatchRepository } from '@/domain/repository/BatchRepository'
import { type ImageRepository } from '@/domain/repository/ImageRepository'
import { inject } from '@/infra/dependency-injection/Registry'
import { BatchNotFoundError, ProcessImageError } from '@/infra/error/ErrorCatalog'
import { ImagineImageGatewayFactory } from '@/infra/gateways/ImagineImageGatewayFactory'
import { type ImageStorage } from '@/infra/storage/ImageStorage'

export class ProcessImage {
  @inject('batchRepository')
  private readonly batchRepository!: BatchRepository

  @inject('imageRepository')
  private readonly imageRepository!: ImageRepository

  @inject('imageStorage')
  private readonly imageStorage!: ImageStorage

  async execute (input: ProcessImageInput): Promise<void> {
    const batch = await this.batchRepository.getBatchById(input.batchId)
    if (!batch) throw new BatchNotFoundError()
    batch.process()
    await this.batchRepository.update(batch)
    const imagineImageGateway = ImagineImageGatewayFactory.create(input.gateway)
    const output = await imagineImageGateway.imagine({
      ...batch,
      batch_size: batch.size,
      width: input.dimensions.width,
      height: input.dimensions.height,
      sampler_index: batch.sampler
    })
    if (output.errorMessage) {
      batch.error(output.errorMessage)
      await this.batchRepository.update(batch)
      throw new ProcessImageError(output.errorMessage)
    }
    batch.processUpdate({ origin: output.origin, modelName: output.model })
    let count = 0
    for (const image of output.images) {
      const path = await this.imageStorage.uploadImage(image)
      const currentImage = Image.create({
        width: input.dimensions.width,
        height: input.dimensions.height,
        seed: Number(output.seeds[count]),
        batchId: batch.id,
        path
      })
      const repositoryImage = await this.imageRepository.create(currentImage)
      batch.addImage(repositoryImage.id)
      count++
    }
    batch.finish()
    await this.batchRepository.update(batch)
  }
}
