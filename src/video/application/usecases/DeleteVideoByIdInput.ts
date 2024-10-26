import { type Batch } from '@/batch/domain/entities/Batch'
import { type BatchRepository } from '@/batch/domain/repositories/BatchRepository'
import { type DeleteVideoByIdInput } from '@/video/application/usecases/dtos/DeleteVideoByIdInput.dto'
import { type VideoRepository } from '@/video/domain/repositories/VideoRepository'
import { type VideoStorage } from '@/video/domain/storage/VideoStorage'
import { VideoNotFoundError } from '@/video/infra/errors/VideoErrorCatalog'
import { inject } from '@api/infra/dependency-injection/Registry'

export class DeleteVideoById {
  @inject('videoRepository')
  private readonly videoRepository!: VideoRepository

  @inject('batchRepository')
  private readonly batchRepository!: BatchRepository

  @inject('videoStorage')
  private readonly videoStorage!: VideoStorage

  async execute ({ id }: DeleteVideoByIdInput): Promise<void> {
    const video = await this.videoRepository.getVideoById(id)
    if (!video) throw new VideoNotFoundError()
    const batch = await this.batchRepository.getBatchById(video.batchId) as Batch
    batch?.removeVideo(id)
    if (!batch?.videos.length) {
      await this.batchRepository.deleteById(batch?.id)
    } else {
      await this.batchRepository.update(batch)
    }
    await this.videoRepository.deleteById(id)
    await this.videoStorage.deleteVideo(video.path)
  }
}
