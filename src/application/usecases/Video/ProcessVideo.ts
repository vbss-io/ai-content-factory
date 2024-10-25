import { Video } from '@/domain/entities/Video'
import { type BatchRepository } from '@/domain/repository/BatchRepository'
import { type VideoRepository } from '@/domain/repository/VideoRepository'
import { inject } from '@/infra/dependency-injection/Registry'
import { BatchNotFoundError, ProcessVideoError } from '@/infra/error/ErrorCatalog'
import { ImagineVideoGatewayFactory } from '@/infra/gateways/ImagineVideoGatewayFactory'
import { type VideoStorage } from '@/infra/storage/VideoStorage'
import { type ProcessVideoInput } from './dto/ProcessVideo.dto'

export class ProcessVideo {
  @inject('batchRepository')
  private readonly batchRepository!: BatchRepository

  @inject('videoRepository')
  private readonly videoRepository!: VideoRepository

  @inject('videoStorage')
  private readonly videoStorage!: VideoStorage

  async execute (input: ProcessVideoInput): Promise<void> {
    const batch = await this.batchRepository.getBatchById(input.batchId)
    if (!batch) throw new BatchNotFoundError()
    batch.process()
    await this.batchRepository.update(batch)
    const imagineVideoGateway = ImagineVideoGatewayFactory.create(input.gateway)
    const output = await imagineVideoGateway.imagine({
      ...batch,
      width: input.dimensions.width,
      height: input.dimensions.height,
      imageUrl: input.imageUrl
    })
    batch.setTaskId(output?.taskId ?? 'none')
    if (output.errorMessage) {
      batch.error(output.errorMessage)
      await this.batchRepository.update(batch)
      throw new ProcessVideoError(output.errorMessage)
    }
    batch.processUpdate({ origin: output.origin, modelName: output.model })
    const video = output.videos[0]
    const path = await this.videoStorage.uploadVideo(video)
    const currentVideo = Video.create({
      width: input.dimensions.width,
      height: input.dimensions.height,
      batchId: batch.id,
      path
    })
    const repositoryVideo = await this.videoRepository.create(currentVideo)
    batch.addVideo(repositoryVideo.id)
    batch.finish()
    await this.batchRepository.update(batch)
  }
}
