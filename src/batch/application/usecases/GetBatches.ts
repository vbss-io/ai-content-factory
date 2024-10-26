import { type GetBatchesInput, type GetBatchesOutput } from '@/batch/application/usecases/dtos/GetBatches.dto'
import { type BatchRepository } from '@/batch/domain/repositories/BatchRepository'
import { type ImageRepository } from '@/image/domain/repositories/ImageRepository'
import { type VideoRepository } from '@/video/domain/repositories/VideoRepository'
import { inject } from '@api/infra/dependency-injection/Registry'

export class GetBatches {
  @inject('batchRepository')
  private readonly batchRepository!: BatchRepository

  @inject('imageRepository')
  private readonly imageRepository!: ImageRepository

  @inject('videoRepository')
  private readonly videoRepository!: VideoRepository

  async execute ({ search_mask, sampler, scheduler, status, origin, modelName, page }: GetBatchesInput): Promise<GetBatchesOutput> {
    const output: GetBatchesOutput = []
    const batches = await this.batchRepository.getBatches(page, search_mask, sampler, scheduler, status, origin, modelName)
    for (const batch of batches) {
      const imagesPaths = await this.imagesPaths(batch.images)
      const videosPaths = await this.videosPaths(batch.videos)
      output.push({ ...batch, images: imagesPaths, videos: videosPaths })
    }
    return output
  }

  async imagesPaths (batchImages: string[]): Promise<string[]> {
    try {
      const images = await this.imageRepository.getImagesByIds(batchImages)
      return images.map((image) => image.path)
    } catch {
      return []
    }
  }

  async videosPaths (batchVideos: string[]): Promise<string[]> {
    try {
      const videos = await this.videoRepository.getVideosByIds(batchVideos)
      return videos.map((video) => video.path)
    } catch {
      return []
    }
  }
}
