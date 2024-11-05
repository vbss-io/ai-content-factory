import { type GetVideosInput, type GetVideosOutput } from '@/video/application/usecases/dtos/GetVideos.dto'
import { type VideoRepository } from '@/video/domain/repositories/VideoRepository'
import { inject } from '@api/infra/dependency-injection/Registry'

export class GetVideos {
  @inject('videoRepository')
  private readonly videoRepository!: VideoRepository

  async execute ({ search_mask, aspectRatio, origin, modelName, page }: GetVideosInput): Promise<GetVideosOutput> {
    return await this.videoRepository.getVideos(page, undefined, search_mask, aspectRatio, origin, modelName)
  }
}
