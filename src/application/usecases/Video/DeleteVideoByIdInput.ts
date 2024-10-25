import { type DeleteVideoByIdInput } from '@/application/usecases/Video/dtos/DeleteVideoByIdInput.dto'
import { type Batch } from '@/domain/entities/Batch'
import { type BatchRepository } from '@/domain/repositories/BatchRepository'
import { type VideoRepository } from '@/domain/repositories/VideoRepository'
import { type VideoStorage } from '@/domain/storage/VideoStorage'
import { inject } from '@api/infra/dependency-injection/Registry'
import { VideoNotFoundError } from '@api/infra/errors/ErrorCatalog'

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
