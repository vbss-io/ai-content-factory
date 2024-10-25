import { type GetImagesInput, type GetImagesOutput } from '@/application/usecases/Image/dtos/GetImages.dto'
import { type ImageRepository } from '@/domain/repositories/ImageRepository'
import { inject } from '@api/infra/dependency-injection/Registry'

export class GetImages {
  @inject('imageRepository')
  private readonly imageRepository!: ImageRepository

  async execute ({ search_mask, sampler, scheduler, aspectRatio, origin, modelName, page }: GetImagesInput): Promise<GetImagesOutput> {
    return await this.imageRepository.getImages(page, search_mask, sampler, scheduler, aspectRatio, origin, modelName)
  }
}
