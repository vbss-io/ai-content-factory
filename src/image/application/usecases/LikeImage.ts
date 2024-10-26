import { UserAuthenticationError } from '@/auth/infra/errors/AuthErrorCatalog'
import { type LikeImageInput } from '@/image/application/usecases/dtos/LikeImage.dto'
import { type ImageRepository } from '@/image/domain/repositories/ImageRepository'
import { ImageNotFoundError } from '@/image/infra/errors/ImageErrorCatalog'
import { type UserRepository } from '@/user/domain/repositories/UserRepository'
import { inject } from '@api/infra/dependency-injection/Registry'

export class LikeImage {
  @inject('userRepository')
  private readonly userRepository!: UserRepository

  @inject('imageRepository')
  private readonly imageRepository!: ImageRepository

  async execute ({ id, username }: LikeImageInput): Promise<void> {
    const user = await this.userRepository.getUserByUsername(username)
    if (!user) throw new UserAuthenticationError()
    const image = await this.imageRepository.getImageById(id)
    if (!image) throw new ImageNotFoundError()
    user.updateImageLikes(id)
    if (user.imageLikes.includes(id)) {
      image.increaseLikes()
    } else {
      image.decreaseLikes()
    }
    await this.userRepository.update(user)
    await this.imageRepository.update(image)
  }
}
