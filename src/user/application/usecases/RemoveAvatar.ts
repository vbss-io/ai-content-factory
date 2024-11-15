import { inject } from '@/@api/infra/dependency-injection/Registry'
import { UserAuthenticationError } from '@/auth/infra/errors/AuthErrorCatalog'
import { type ImageStorage } from '@/image/domain/storage/ImageStorage'
import { type UserRepository } from '@/user/domain/repositories/UserRepository'
import { type RemoveAvatarInput } from './dtos/RemoveAvatar.dto'

export class RemoveAvatar {
  @inject('userRepository')
  private readonly userRepository!: UserRepository

  @inject('imageStorage')
  private readonly imageStorage!: ImageStorage

  async execute ({ userId }: RemoveAvatarInput): Promise<void> {
    const user = await this.userRepository.getUserByUserId(userId)
    if (!user) throw new UserAuthenticationError()
    if (user.avatar) {
      await this.imageStorage.deleteImage(user.avatar)
    }
    user.updateAvatar('')
    await this.userRepository.update(user)
  }
}
