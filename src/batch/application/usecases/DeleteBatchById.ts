import { type DeleteBatchByIdInput } from '@/batch/application/usecases/dtos/DeleteBatchById.dto'
import { type BatchRepository } from '@/batch/domain/repositories/BatchRepository'
import { BatchNotFoundError } from '@/batch/infra/errors/BatchErrorCatalog'
import { type ImageRepository } from '@/image/domain/repositories/ImageRepository'
import { type ImageStorage } from '@/image/domain/storage/ImageStorage'
import { type VideoRepository } from '@/video/domain/repositories/VideoRepository'
import { type VideoStorage } from '@/video/domain/storage/VideoStorage'
import { inject } from '@api/infra/dependency-injection/Registry'

export class DeleteBatchById {
  @inject('imageRepository')
  private readonly imageRepository!: ImageRepository

  @inject('batchRepository')
  private readonly batchRepository!: BatchRepository

  @inject('imageStorage')
  private readonly imageStorage!: ImageStorage

  @inject('videoRepository')
  private readonly videoRepository!: VideoRepository

  @inject('videoStorage')
  private readonly videoStorage!: VideoStorage

  async execute ({ id }: DeleteBatchByIdInput): Promise<void> {
    const batch = await this.batchRepository.getBatchById(id)
    if (!batch) throw new BatchNotFoundError()
    await this.deleteImages(batch.images)
    await this.deleteVideos(batch.videos)
    await this.batchRepository.deleteById(batch.id)
  }

  async deleteImages (batchImages: string[]): Promise<void> {
    try {
      const images = await this.imageRepository.getImagesByIds(batchImages)
      for (const image of images) {
        await this.imageStorage.deleteImage(image.path)
        await this.imageRepository.deleteById(image.id)
      }
    } catch {}
  }

  async deleteVideos (batchVideos: string[]): Promise<void> {
    try {
      const videos = await this.videoRepository.getVideosByIds(batchVideos)
      for (const video of videos) {
        await this.videoStorage.deleteVideo(video.path)
        await this.videoRepository.deleteById(video.id)
      }
    } catch {}
  }
}
