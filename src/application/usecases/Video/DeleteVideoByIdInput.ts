import { type DeleteVideoByIdInput } from '@/application/usecases/Video/dto/DeleteVideoByIdInput.dto'
import { type Batch } from '@/domain/entities/Batch'
import { type BatchRepository } from '@/domain/repository/BatchRepository'
import { type VideoRepository } from '@/domain/repository/VideoRepository'
import { inject } from '@/infra/dependency-injection/Registry'
import { VideoNotFoundError } from '@/infra/error/ErrorCatalog'
import { type VideoStorage } from '@/infra/storage/VideoStorage'

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
