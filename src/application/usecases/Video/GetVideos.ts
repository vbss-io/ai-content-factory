import { type GetVideosInput, type GetVideosOutput } from '@/application/usecases/Video/dto/GetVideos.dto'
import { type VideoRepository } from '@/domain/repository/VideoRepository'
import { inject } from '@/infra/dependency-injection/Registry'

export class GetVideos {
  @inject('videoRepository')
  private readonly videoRepository!: VideoRepository

  async execute ({ search_mask, aspectRatio, origin, modelName, page }: GetVideosInput): Promise<GetVideosOutput> {
    return await this.videoRepository.getVideos(page, search_mask, aspectRatio, origin, modelName)
  }
}
