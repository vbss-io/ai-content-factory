import { type GetImagesInput, type GetImagesOutput } from '@/image/application/usecases/dtos/GetImages.dto'
import { type ImageRepository } from '@/image/domain/repositories/ImageRepository'
import { inject } from '@api/infra/dependency-injection/Registry'

export class GetImages {
  @inject('imageRepository')
  private readonly imageRepository!: ImageRepository

  async execute ({ userId, search_mask, sampler, scheduler, aspectRatio, origin, modelName, page }: GetImagesInput): Promise<GetImagesOutput> {
    return await this.imageRepository.getImages(page, userId, search_mask, sampler, scheduler, aspectRatio, origin, modelName)
  }
}
