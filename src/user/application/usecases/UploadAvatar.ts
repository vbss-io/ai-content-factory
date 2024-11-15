import { inject } from '@/@api/infra/dependency-injection/Registry'
import { UserAuthenticationError } from '@/auth/infra/errors/AuthErrorCatalog'
import { FailedToConvertBatchFile } from '@/batch/infra/errors/BatchErrorCatalog'
import { type ImageStorage } from '@/image/domain/storage/ImageStorage'
import { type UserRepository } from '@/user/domain/repositories/UserRepository'
import { type UploadAvatarInput, type UploadAvatarOutput } from './dtos/UploadAvatar.dto'

export class UploadAvatar {
  @inject('userRepository')
  private readonly userRepository!: UserRepository

  @inject('imageStorage')
  private readonly imageStorage!: ImageStorage

  async execute ({ userId, files }: UploadAvatarInput): Promise<UploadAvatarOutput> {
    const user = await this.userRepository.getUserByUserId(userId)
    if (!user) throw new UserAuthenticationError()
    const avatar = files[0]
    const base64Avatar = this.fileBufferToBase64(avatar)
    if (!base64Avatar) throw new FailedToConvertBatchFile('image')
    if (user.avatar) {
      await this.imageStorage.deleteImage(user.avatar)
    }
    const newAvatarPath = await this.imageStorage.uploadImage(base64Avatar)
    user.updateAvatar(newAvatarPath)
    await this.userRepository.update(user)
    return {
      path: newAvatarPath
    }
  }

  fileBufferToBase64 (file: any): string {
    return file.buffer.toString('base64')
  }
}
