import { UserAuthenticationError } from '@/auth/infra/errors/AuthErrorCatalog'
import { type Batch } from '@/batch/domain/entities/Batch'
import { type BatchRepository } from '@/batch/domain/repositories/BatchRepository'
import { type User } from '@/user/domain/entities/User'
import { type UserRepository } from '@/user/domain/repositories/UserRepository'
import { type GetVideoByIdInput, type GetVideoByIdOutput } from '@/video/application/usecases/dtos/GetVideoById.dto'
import { type VideoRepository } from '@/video/domain/repositories/VideoRepository'
import { VideoNotFoundError } from '@/video/infra/errors/VideoErrorCatalog'
import { inject } from '@api/infra/dependency-injection/Registry'

export class GetVideoById {
  @inject('videoRepository')
  private readonly videoRepository!: VideoRepository

  @inject('batchRepository')
  private readonly batchRepository!: BatchRepository

  @inject('userRepository')
  private readonly userRepository!: UserRepository

  async execute ({ id, userId }: GetVideoByIdInput): Promise<GetVideoByIdOutput> {
    const video = await this.videoRepository.getVideoById(id)
    if (!video) throw new VideoNotFoundError()
    let userLiked = false
    if (userId) {
      const user = await this.userRepository.getUserByUserId(userId)
      if (!user) throw new UserAuthenticationError()
      userLiked = user.videoLikes.includes(id)
    }
    const batch = await this.batchRepository.getBatchById(video.batchId) as Batch
    const author = await this.userRepository.getUserByUserId(batch.author) as User
    return {
      ...video,
      prompt: batch.prompt,
      negativePrompt: batch.negativePrompt,
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
