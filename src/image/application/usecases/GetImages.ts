import { UserAuthenticationError } from '@/auth/infra/errors/AuthErrorCatalog'
import { type GetImagesInput, type GetImagesOutput } from '@/image/application/usecases/dtos/GetImages.dto'
import { type ImageRepository } from '@/image/domain/repositories/ImageRepository'
import { type User } from '@/user/domain/entities/User'
import { type UserRepository } from '@/user/domain/repositories/UserRepository'
import { inject } from '@api/infra/dependency-injection/Registry'

export class GetImages {
  @inject('imageRepository')
  private readonly imageRepository!: ImageRepository

  @inject('userRepository')
  private readonly userRepository!: UserRepository

  async execute ({ userId, search_mask, sampler, scheduler, aspectRatio, origin, modelName, page }: GetImagesInput): Promise<GetImagesOutput> {
    let user: User | undefined
    if (userId) {
      user = await this.userRepository.getUserByUserId(userId)
      if (!user) throw new UserAuthenticationError()
    }
    const images = await this.imageRepository.getImages(page, search_mask, sampler, scheduler, aspectRatio, origin, modelName)
    return images.map((image) => {
      const userLiked = user?.imageLikes.includes(image.id) ?? false
      return {
        ...image,
        userLiked
      }
    })
  }
}
