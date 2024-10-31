import { inject } from '@/@api/infra/dependency-injection/Registry'
import { type CreateManualBatchInput, type CreateManualBatchOutput } from '@/batch/application/usecases/dtos/CreateManualBatch.dto'
import { Batch } from '@/batch/domain/entities/Batch'
import { type BatchRepository } from '@/batch/domain/repositories/BatchRepository'
import { FailedToConvertBatchFile } from '@/batch/infra/errors/BatchErrorCatalog'
import { Image } from '@/image/domain/entities/Image'
import { type ImageRepository } from '@/image/domain/repositories/ImageRepository'
import { type ImageStorage } from '@/image/domain/storage/ImageStorage'
import { Video } from '@/video/domain/entities/Video'
import { type VideoRepository } from '@/video/domain/repositories/VideoRepository'
import { type VideoStorage } from '@/video/domain/storage/VideoStorage'

export class CreateManualBatch {
  @inject('batchRepository')
  private readonly batchRepository!: BatchRepository

  @inject('imageRepository')
  private readonly imageRepository!: ImageRepository

  @inject('videoRepository')
  private readonly videoRepository!: VideoRepository

  @inject('imageStorage')
  private readonly imageStorage!: ImageStorage

  @inject('videoStorage')
  private readonly videoStorage!: VideoStorage

  async execute (input: CreateManualBatchInput): Promise<CreateManualBatchOutput> {
    const images = input.images ?? []
    const videos = input.videos ?? []
    const batch = Batch.create({
      prompt: input.prompt,
      negativePrompt: input.negative_prompt,
      sampler: 'none',
      scheduler: 'none',
      steps: 0,
      size: (input.images?.length ?? 0) + (input.videos?.length ?? 0),
      author: input.author,
      authorName: input.authorName,
      automatic: false
    })
    batch.processUpdate({ origin: input.origin, modelName: input.model_name })
    const repositoryBatch = await this.batchRepository.create(batch)
    try {
      for (const image of images) {
        const name = image.originalname
        const base64Image = this.fileBufferToBase64(image)
        if (!base64Image) throw new FailedToConvertBatchFile('image')
        const imagePath = await this.imageStorage.uploadImage(base64Image)
        const size = input.sizes ? input.sizes[name] : { width: 0, height: 0 }
        const newImage = Image.create({
          width: size.width,
          height: size.height,
          seed: 0,
          path: imagePath,
          batchId: repositoryBatch.id
        })
        const repositoryImage = await this.imageRepository.create(newImage)
        repositoryBatch.addImage(repositoryImage.id)
      }
      for (const video of videos) {
        const name = video.originalname
        const base64Video = this.fileBufferToBase64(video)
        if (!base64Video) throw new FailedToConvertBatchFile('video')
        const videoPath = await this.videoStorage.uploadVideo(base64Video)
        const size = input.sizes ? input.sizes[name] : { width: 0, height: 0 }
        const newVideo = Video.create({
          width: size.width,
          height: size.height,
          path: videoPath,
          batchId: repositoryBatch.id
        })
        const repositoryVideo = await this.videoRepository.create(newVideo)
        repositoryBatch.addVideo(repositoryVideo.id)
      }
      repositoryBatch.finish()
      await this.batchRepository.update(repositoryBatch)
      return {
        batchId: repositoryBatch.id,
        status: 'success'
      }
    } catch (error: any) {
      repositoryBatch.error(error.message as string)
      await this.batchRepository.update(repositoryBatch)
      return {
        batchId: repositoryBatch.id,
        status: 'error'
      }
    }
  }

  fileBufferToBase64 (file: any): string {
    return file.buffer.toString('base64')
  }
}
