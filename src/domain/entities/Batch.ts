import { type BatchConfigurationInput, type BatchConfigurationOutput, type BatchCreate, type BatchProcessUpdate, type BatchRestore } from '@/domain/entities/dto/Batch.dto'
import { type ImageRequestedData, ImageRequested } from '@/domain/events/ImageRequested'
import { BatchIdError, DalleDimensionsError } from '@/infra/error/ErrorCatalog'
import { Observable } from '@/infra/events/Observer'

export class Batch extends Observable {
  id: string
  status: string
  origin: string
  modelName: string
  errorMessage: string
  images: string[]

  private constructor (
    id: string,
    status: string,
    readonly prompt: string,
    readonly sampler: string,
    readonly scheduler: string,
    readonly steps: number,
    images: string[],
    readonly size: number,
    origin: string,
    modelName: string,
    readonly negativePrompt: string,
    errorMessage: string,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {
    super()
    this.id = id
    this.status = status
    this.images = images ?? []
    this.origin = origin
    this.modelName = modelName
    this.errorMessage = errorMessage
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
      input.images,
      input.size,
      '',
      '',
      input.negativePrompt ?? '',
      ''
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
      input.size,
      input.origin,
      input.modelName,
      input.negativePrompt,
      input.errorMessage,
      input.createdAt,
      input.updatedAt
    )
  }

  async request ({ gateway, dimensions, isAutomatic }: Omit<ImageRequestedData, 'batchId'>): Promise<void> {
    if (!this.id) throw new BatchIdError()
    await this.notify(new ImageRequested({ batchId: this.id, gateway, isAutomatic, dimensions }))
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

  static getConfigurations (gateway: string, input: BatchConfigurationInput): BatchConfigurationOutput {
    const negativePrompt = input.negativePrompt ?? 'none'
    const baseConfiguration = {
      sampler: 'none',
      scheduler: 'none',
      steps: 0,
      size: 0,
      negativePrompt: 'none'
    }
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
