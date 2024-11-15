import { UserAuthenticationError } from '@/auth/infra/errors/AuthErrorCatalog'
import { type UserRepository } from '@/user/domain/repositories/UserRepository'
import { type GetUserVideosInput, type GetUserVideosOutput } from '@/video/application/usecases/dtos/GetUserVideos.dto'
import { type VideoRepository } from '@/video/domain/repositories/VideoRepository'
import { inject } from '@api/infra/dependency-injection/Registry'

export class GetUserVideos {
  @inject('videoRepository')
  private readonly videoRepository!: VideoRepository

  @inject('userRepository')
  private readonly userRepository!: UserRepository

  async execute ({ userId, page }: GetUserVideosInput): Promise<GetUserVideosOutput> {
    const user = await this.userRepository.getUserByUserId(userId)
    if (!user) throw new UserAuthenticationError()
    const videos = await this.videoRepository.getUserVideos(page, userId)
    return videos.map((video) => {
      const userLiked = user?.videoLikes.includes(video.id) ?? false
      return {
        ...video,
        userLiked
      }
    })
  }
}
