import { UserAuthenticationError } from '@/auth/infra/errors/AuthErrorCatalog'
import { type Batch } from '@/batch/domain/entities/Batch'
import { type BatchRepository } from '@/batch/domain/repositories/BatchRepository'
import { type GetImageByIdInput, type GetImageByIdOutput } from '@/image/application/usecases/dtos/GetImageById.dto'
import { type ImageRepository } from '@/image/domain/repositories/ImageRepository'
import { ImageNotFoundError } from '@/image/infra/errors/ImageErrorCatalog'
import { type User } from '@/user/domain/entities/User'
import { type UserRepository } from '@/user/domain/repositories/UserRepository'
import { inject } from '@api/infra/dependency-injection/Registry'

export class GetImageById {
  @inject('imageRepository')
  private readonly imageRepository!: ImageRepository

  @inject('batchRepository')
  private readonly batchRepository!: BatchRepository

  @inject('userRepository')
  private readonly userRepository!: UserRepository

  async execute ({ id, userId }: GetImageByIdInput): Promise<GetImageByIdOutput> {
    const image = await this.imageRepository.getImageById(id)
    if (!image) throw new ImageNotFoundError()
    let userLiked = false
    if (userId) {
      const user = await this.userRepository.getUserByUserId(userId)
      if (!user) throw new UserAuthenticationError()
      userLiked = user.imageLikes.includes(id)
    }
    const batch = await this.batchRepository.getBatchById(image.batchId) as Batch
    const author = await this.userRepository.getUserByUserId(batch.author) as User
    return {
      ...image,
      prompt: batch.prompt,
      negativePrompt: batch.negativePrompt,
      sampler: batch.sampler,
      scheduler: batch.scheduler,
      steps: batch.steps,
      origin: batch.origin,
      modelName: batch.modelName,
      authorName: author.username,
      authorAvatar: author.avatar,
      automatic: batch.automatic,
      owner: batch.author === userId,
      userLiked
    }
  }
}
