import { type BatchRepository } from '@/batch/domain/repositories/BatchRepository'
import { BatchNotFoundError } from '@/batch/infra/errors/BatchErrorCatalog'
import { type ProcessVideoInput } from '@/video/application/usecases/dtos/ProcessVideo.dto'
import { Video } from '@/video/domain/entities/Video'
import { type VideoRepository } from '@/video/domain/repositories/VideoRepository'
import { type VideoStorage } from '@/video/domain/storage/VideoStorage'
import { ProcessVideoError } from '@/video/infra/errors/VideoErrorCatalog'
import { ImagineVideoGatewayFactory } from '@/video/infra/gateways/ImagineVideoGatewayFactory'
import { inject } from '@api/infra/dependency-injection/Registry'

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
