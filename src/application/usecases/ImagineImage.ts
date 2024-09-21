import { type ImagineImageOutput } from '@/application/usecases/dto/ImagineImage.dto'
import { Image } from '@/domain/entities/Image'
import { type ImageRepository } from '@/domain/repository/ImageRepository'
import { inject } from '@/infra/dependency-injection/Registry'
import { type ImagineImageGateway } from '@/infra/gateways/ImagineImageGateway'
import { type ImagineImageInput } from '@/infra/schemas/ImagineImageSchema'
import { type ImageStorage } from '@/infra/storage/ImageStorage'

export class ImagineImage {
  @inject('imagineImageGateway')
  private readonly imagineImageGateway!: ImagineImageGateway

  @inject('imageRepository')
  private readonly imageRepository!: ImageRepository

  @inject('imageStorage')
  private readonly imageStorage!: ImageStorage

  async execute (input: ImagineImageInput): Promise<ImagineImageOutput> {
    const { prompt, width, height } = input
    const output = await this.imagineImageGateway.imagine(input)
    for (const image of output.images) {
      const currentImage = Image.create({ prompt, width, height })
      await this.imageRepository.create(currentImage)
      await this.imageStorage.uploadImage(image)
    }
    return output as any
  }
}
