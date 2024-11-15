import { UserAuthenticationError } from '@/auth/infra/errors/AuthErrorCatalog'
import { type User } from '@/user/domain/entities/User'
import { type UserRepository } from '@/user/domain/repositories/UserRepository'
import { type GetVideosInput, type GetVideosOutput } from '@/video/application/usecases/dtos/GetVideos.dto'
import { type VideoRepository } from '@/video/domain/repositories/VideoRepository'
import { inject } from '@api/infra/dependency-injection/Registry'

export class GetVideos {
  @inject('videoRepository')
  private readonly videoRepository!: VideoRepository

  @inject('userRepository')
  private readonly userRepository!: UserRepository

  async execute ({ userId, search_mask, aspectRatio, origin, modelName, page }: GetVideosInput): Promise<GetVideosOutput> {
    let user: User | undefined
    if (userId) {
      user = await this.userRepository.getUserByUserId(userId)
      if (!user) throw new UserAuthenticationError()
    }
    const videos = await this.videoRepository.getVideos(page, search_mask, aspectRatio, origin, modelName)
    return videos.map((video) => {
      const userLiked = user?.videoLikes.includes(video.id) ?? false
      return {
        ...video,
        userLiked
      }
    })
  }
}
