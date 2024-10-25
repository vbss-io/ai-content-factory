import { inject } from '@/@api/infra/dependency-injection/Registry'
import { type GetVideosInput, type GetVideosOutput } from '@/application/usecases/Video/dtos/GetVideos.dto'
import { type VideoRepository } from '@/domain/repositories/VideoRepository'

export class GetVideos {
  @inject('videoRepository')
  private readonly videoRepository!: VideoRepository

  async execute ({ search_mask, aspectRatio, origin, modelName, page }: GetVideosInput): Promise<GetVideosOutput> {
    return await this.videoRepository.getVideos(page, search_mask, aspectRatio, origin, modelName)
  }
}
