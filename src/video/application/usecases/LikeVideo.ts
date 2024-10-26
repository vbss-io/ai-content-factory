import { UserAuthenticationError } from '@/auth/infra/errors/AuthErrorCatalog'
import { type UserRepository } from '@/user/domain/repositories/UserRepository'
import { type LikeVideoInput } from '@/video/application/usecases/dtos/LikeVideo.dto'
import { type VideoRepository } from '@/video/domain/repositories/VideoRepository'
import { VideoNotFoundError } from '@/video/infra/errors/VideoErrorCatalog'
import { inject } from '@api/infra/dependency-injection/Registry'

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
