import { type BatchConfigurationInput, type BatchConfigurationOutput, type BatchCreate, type BatchProcessUpdate, type BatchRestore } from '@/batch/domain/entities/dtos/Batch.dto'
import { BatchIdError } from '@/batch/infra/errors/BatchErrorCatalog'
import { ImageRequested, type ImageRequestedData } from '@/image/domain/events/ImageRequested'
import { DalleDimensionsError } from '@/image/infra/errors/ImageErrorCatalog'
import { VideoRequested, type VideoRequestedData } from '@/video/domain/events/VideoRequested'
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

  async requestImage ({ gateway, dimensions, isAutomatic }: Omit<ImageRequestedData, 'batchId'>): Promise<void> {
    if (!this.id) throw new BatchIdError()
    await this.notify(new ImageRequested({ batchId: this.id, gateway, isAutomatic, dimensions }))
  }

  async requestVideo ({ gateway, dimensions, isAutomatic, imageUrl }: Omit<VideoRequestedData, 'batchId'>): Promise<void> {
    if (!this.id) throw new BatchIdError()
    await this.notify(new VideoRequested({ batchId: this.id, gateway, isAutomatic, dimensions, imageUrl }))
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

  static isAutomatic1111 (gateway: string): boolean {
    return gateway === 'automatic1111'
  }

  static isGoApiMidjourney (gateway: string): boolean {
    return gateway === 'goApiMidjourney'
  }

  static isOpenAiDalle (gateway: string): boolean {
    return gateway === 'openAiDalle3'
  }

  static dalleDimensionsCheck (width: number, height: number): void {
    const allowedDimensions = ['1024x1024', '1024x1792', '1792x1024']
    const dimension = `${width}x${height}`
    if (!allowedDimensions.includes(dimension)) {
      throw new DalleDimensionsError()
    }
  }

  static getConfigurations (gateway: string, input?: BatchConfigurationInput): BatchConfigurationOutput {
    const baseConfiguration = {
      sampler: 'none',
      scheduler: 'none',
      steps: 0,
      size: 1,
      negativePrompt: 'none'
    }
    if (!input) return baseConfiguration
    const negativePrompt = input.negativePrompt ?? 'none'
    if (this.isAutomatic1111(gateway)) {
      return {
        sampler: input.sampler,
        scheduler: input.scheduler,
        steps: input.steps,
        size: input.size,
        negativePrompt
      }
    }
    if (this.isGoApiMidjourney(gateway)) {
      return {
        ...baseConfiguration,
        size: 4
      }
    }
    if (this.isOpenAiDalle(gateway)) {
      this.dalleDimensionsCheck(input.width, input.height)
      return {
        ...baseConfiguration,
        size: input.size
      }
    }
    return baseConfiguration
  }
}
