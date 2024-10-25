import { inject } from '@/@api/infra/dependency-injection/Registry'
import { UserAuthenticationError, VideoNotFoundError } from '@/@api/infra/errors/ErrorCatalog'
import { type LikeVideoInput } from '@/application/usecases/Video/dtos/LikeVideo.dto'
import { type UserRepository } from '@/domain/repositories/UserRepository'
import { type VideoRepository } from '@/domain/repositories/VideoRepository'

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
