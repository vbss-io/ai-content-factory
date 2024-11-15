import { UserAuthenticationError } from '@/auth/infra/errors/AuthErrorCatalog'
import { type GetUserImagesInput, type GetUserImagesOutput } from '@/image/application/usecases/dtos/GetUserImages.dto'
import { type ImageRepository } from '@/image/domain/repositories/ImageRepository'
import { type UserRepository } from '@/user/domain/repositories/UserRepository'
import { inject } from '@api/infra/dependency-injection/Registry'

export class GetUserImages {
  @inject('imageRepository')
  private readonly imageRepository!: ImageRepository

  @inject('userRepository')
  private readonly userRepository!: UserRepository

  async execute ({ userId, page }: GetUserImagesInput): Promise<GetUserImagesOutput> {
    const user = await this.userRepository.getUserByUserId(userId)
    if (!user) throw new UserAuthenticationError()
    const images = await this.imageRepository.getUserImages(page, user.id)
    return images.map((image) => {
      const userLiked = user?.imageLikes.includes(image.id) ?? false
      return {
        ...image,
        userLiked
      }
    })
  }
}
