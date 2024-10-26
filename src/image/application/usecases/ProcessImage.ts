import { type BatchRepository } from '@/batch/domain/repositories/BatchRepository'
import { BatchNotFoundError } from '@/batch/infra/errors/BatchErrorCatalog'
import { type ProcessImageInput } from '@/image/application/usecases/dtos/ProcessImage.dto'
import { Image } from '@/image/domain/entities/Image'
import { type ImageRepository } from '@/image/domain/repositories/ImageRepository'
import { type ImageStorage } from '@/image/domain/storage/ImageStorage'
import { ProcessImageError } from '@/image/infra/errors/ImageErrorCatalog'
import { ImagineImageGatewayFactory } from '@/image/infra/gateways/ImagineImageGatewayFactory'
import { inject } from '@api/infra/dependency-injection/Registry'

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
    batch.setTaskId(output?.taskId ?? 'none')
    batch.processUpdate({ origin: output.origin, modelName: output.model })
    if (output.errorMessage) {
      batch.error(output.errorMessage)
      await this.batchRepository.update(batch)
      throw new ProcessImageError(output.errorMessage)
    }
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
