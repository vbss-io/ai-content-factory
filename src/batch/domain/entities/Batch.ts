import { type BatchConfigurationInput, type BatchConfigurationOutput, type BatchCreate, type BatchProcessUpdate, type BatchRestore } from '@/batch/domain/entities/dtos/Batch.dto'
import { BatchIdError } from '@/batch/infra/errors/BatchErrorCatalog'
import { ImageRequested, type ImageRequestedData } from '@/image/domain/events/ImageRequested'
import { Automatic1111DimensionsError, DalleDimensionsError, MidjourneyDimensionsError } from '@/image/infra/errors/ImageErrorCatalog'
import { VideoRequested, type VideoRequestedData } from '@/video/domain/events/VideoRequested'
import { LumaLabsDimensionsError } from '@/video/infra/errors/VideoErrorCatalog'
import { Observable } from '@api/infra/events/Observer'

export class Batch extends Observable {
  id: string
  status: string
  origin: string
  modelName: string
  errorMessage: string
  images: string[]
  videos: string[]
  taskId: string

  private constructor (
    id: string,
    status: string,
    readonly prompt: string,
    readonly sampler: string,
    readonly scheduler: string,
    readonly steps: number,
    images: string[],
    videos: string[],
    readonly size: number,
    origin: string,
    modelName: string,
    readonly negativePrompt: string,
    errorMessage: string,
    taskId: string,
    readonly author: string,
    readonly automatic: boolean,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {
    super()
    this.id = id
    this.status = status
    this.images = images ?? []
    this.videos = videos ?? []
    this.origin = origin
    this.modelName = modelName
    this.errorMessage = errorMessage
    this.taskId = taskId
  }

  static create (input: BatchCreate): Batch {
    const status = 'queued'
    return new Batch(
      '',
      status,
      input.prompt,
      input.sampler,
      input.scheduler,
      input.steps,
      [],
      [],
      input.size,
      '',
      '',
      input.negativePrompt ?? '',
      '',
      '',
      input.author,
      input.automatic
    )
  }

  static restore (input: BatchRestore): Batch {
    return new Batch(
      input.id,
      input.status,
      input.prompt,
      input.sampler,
      input.scheduler,
      input.steps,
      input.images,
      input.videos,
      input.size,
      input.origin,
      input.modelName,
      input.negativePrompt,
      input.errorMessage,
      input.taskId,
      input.author,
      input.automatic,
      input.createdAt,
      input.updatedAt
    )
  }

  async requestImage ({ gateway, aspectRatio, isAutomatic }: Omit<ImageRequestedData, 'batchId'>): Promise<void> {
    if (!this.id) throw new BatchIdError()
    await this.notify(new ImageRequested({ batchId: this.id, gateway, isAutomatic, aspectRatio }))
  }

  async requestVideo ({ gateway, aspectRatio, isAutomatic, imageUrl }: Omit<VideoRequestedData, 'batchId'>): Promise<void> {
    if (!this.id) throw new BatchIdError()
    await this.notify(new VideoRequested({ batchId: this.id, gateway, isAutomatic, aspectRatio, imageUrl }))
  }

  process (): void {
    this.status = 'processing'
  }

  error (message: string): void {
    this.errorMessage = message
    this.status = 'error'
  }

  finish (): void {
    this.status = 'processed'
  }

  processUpdate (input: BatchProcessUpdate): void {
    this.origin = input.origin
    this.modelName = input.modelName
  }

  addImage (imageId: string): void {
    this.images.push(imageId)
  }

  removeImage (imageId: string): void {
    const newImages = this.images.filter((id) => id !== imageId)
    this.images = newImages
  }

  addVideo (videoId: string): void {
    this.videos.push(videoId)
  }

  removeVideo (videoId: string): void {
    const newVideos = this.videos.filter((id) => id !== videoId)
    this.videos = newVideos
  }

  setTaskId (id: string): void {
    this.taskId = id
  }

  static configurationFactory (input: BatchConfigurationInput): BatchConfigurationOutput {
    if (input.gateway === 'automatic1111') return this.getAutomatic1111Configuration(input)
    if (input.gateway === 'goApiMidjourney') return this.getGoApiMidjourneyConfiguration(input)
    if (input.gateway === 'openAiDalle3') return this.getOpenAiDalleConfiguration(input)
    if (input.gateway === 'lumaLabs') return this.getLumaLabsConfiguration(input)
    return this.getDefaultConfigurations()
  }

  static getDefaultConfigurations (): BatchConfigurationOutput {
    return {
      sampler: 'none',
      scheduler: 'none',
      steps: 0,
      size: 1,
      negativePrompt: 'none'
    }
  }

  static getAutomatic1111Configuration (input: BatchConfigurationInput): BatchConfigurationOutput {
    const allowedAspectRatios = ['1:1', '16:9', '9:16', '4:3', '3:4', '21:9', '9:21']
    if (!allowedAspectRatios.includes(input.aspectRatio)) throw new Automatic1111DimensionsError()
    return {
      sampler: input.sampler as string,
      scheduler: input.scheduler as string,
      steps: input.steps as number,
      size: input.size as number,
      negativePrompt: input.negativePrompt ?? 'none'
    }
  }

  static getGoApiMidjourneyConfiguration (input: BatchConfigurationInput): BatchConfigurationOutput {
    // const allowedAspectRatios = ['1:1', '9:16', '16:9']
    const allowedAspectRatios = ['1:1', '16:9', '9:16', '4:3', '3:4', '21:9', '9:21']
    if (!allowedAspectRatios.includes(input.aspectRatio)) throw new MidjourneyDimensionsError()
    return {
      ...this.getDefaultConfigurations(),
      size: 4
    }
  }

  static getOpenAiDalleConfiguration (input: BatchConfigurationInput): BatchConfigurationOutput {
    const allowedAspectRatios = ['1:1', '9:16', '16:9']
    if (!allowedAspectRatios.includes(input.aspectRatio)) throw new DalleDimensionsError()
    return {
      ...this.getDefaultConfigurations(),
      size: input.size as number
    }
  }

  static getLumaLabsConfiguration (input: BatchConfigurationInput): BatchConfigurationOutput {
    const allowedAspectRatios = ['1:1', '16:9', '9:16', '4:3', '3:4', '21:9', '9:21']
    if (!allowedAspectRatios.includes(input.aspectRatio)) throw new LumaLabsDimensionsError()
    return {
      ...this.getDefaultConfigurations()
    }
  }
}
