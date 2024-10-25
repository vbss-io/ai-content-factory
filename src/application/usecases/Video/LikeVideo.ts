import { type LikeVideoInput } from '@/application/usecases/Video/dto/LikeVideo.dto'
import { type UserRepository } from '@/domain/repository/UserRepository'
import { type VideoRepository } from '@/domain/repository/VideoRepository'
import { inject } from '@/infra/dependency-injection/Registry'
import { UserAuthenticationError, VideoNotFoundError } from '@/infra/error/ErrorCatalog'

export class LikeVideo {
  @inject('userRepository')
  private readonly userRepository!: UserRepository

  @inject('videoRepository')
  private readonly videoRepository!: VideoRepository

  async execute ({ id, username }: LikeVideoInput): Promise<void> {
    const user = await this.userRepository.getUserByUsername(username)
    if (!user) throw new UserAuthenticationError()
    const video = await this.videoRepository.getVideoById(id)
    if (!video) throw new VideoNotFoundError()
    user.updateVideoLikes(id)
    if (user.videoLikes.includes(id)) {
      video.increaseLikes()
    } else {
      video.decreaseLikes()
    }
    await this.userRepository.update(user)
    await this.videoRepository.update(video)
  }
}
