import { type GetImagesInput, type GetImagesOutput } from '@/application/usecases/Image/dto/GetImages.dto'
import { type ImageRepository } from '@/domain/repository/ImageRepository'
import { inject } from '@/infra/dependency-injection/Registry'

export class GetImages {
  @inject('imageRepository')
  private readonly imageRepository!: ImageRepository

  async execute ({ search_mask, page }: GetImagesInput): Promise<GetImagesOutput> {
    return await this.imageRepository.getImages(page, search_mask)
  }
}
