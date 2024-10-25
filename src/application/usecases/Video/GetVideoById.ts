import { type Batch } from '@/domain/entities/Batch'
import { type BatchRepository } from '@/domain/repository/BatchRepository'
import { type UserRepository } from '@/domain/repository/UserRepository'
import { type VideoRepository } from '@/domain/repository/VideoRepository'
import { inject } from '@/infra/dependency-injection/Registry'
import { UserAuthenticationError, VideoNotFoundError } from '@/infra/error/ErrorCatalog'
import { type GetVideoByIdInput, type GetVideoByIdOutput } from './dto/GetVideoById.dto'

export class GetVideoById {
  @inject('videoRepository')
  private readonly videoRepository!: VideoRepository

  @inject('batchRepository')
  private readonly batchRepository!: BatchRepository

  @inject('userRepository')
  private readonly userRepository!: UserRepository

  async execute ({ id, username }: GetVideoByIdInput): Promise<GetVideoByIdOutput> {
    const video = await this.videoRepository.getVideoById(id)
    if (!video) throw new VideoNotFoundError()
    let userLiked = false
    if (username) {
      const user = await this.userRepository.getUserByUsername(username)
      if (!user) throw new UserAuthenticationError()
      userLiked = user.videoLikes.includes(id)
    }
    const batch = await this.batchRepository.getBatchById(video.batchId) as Batch
    return {
      ...video,
      prompt: batch.prompt,
      negativePrompt: batch.negativePrompt,
      origin: batch.origin,
      modelName: batch.modelName,
      userLiked
    }
  }
}
