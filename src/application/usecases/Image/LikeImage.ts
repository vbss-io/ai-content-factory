import { type ImageRepository } from '@/domain/repository/ImageRepository'
import { type UserRepository } from '@/domain/repository/UserRepository'
import { inject } from '@/infra/dependency-injection/Registry'
import { ImageNotFoundError, UserAuthenticationError } from '@/infra/error/ErrorCatalog'
import { type LikeImageInput } from './dto/LikeImage.dto'

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
