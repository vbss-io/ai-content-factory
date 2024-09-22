import { type BatchCreate, type BatchProcessUpdate, type BatchRestore } from '@/domain/entities/dto/Batch.dto'
import { type ImageRequestedData, ImageRequested } from '@/domain/events/ImageRequested'
import { BatchIdError } from '@/infra/error/ErrorCatalog'
import { Observable } from '@/infra/events/Observer'

export class Batch extends Observable {
  id?: string
  status: string
  origin?: string
  modelName?: string

  private constructor (
    id: string | undefined,
    status: string,
    readonly prompt: string,
    readonly sampler: string,
    readonly scheduler: string,
    readonly steps: number,
    readonly images: string[],
    readonly size: number,
    origin?: string,
    readonly negativePrompt?: string,
    modelName?: string,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {
    super()
    this.id = id
    this.status = status
    this.origin = origin
    this.modelName = modelName
  }

  static create (input: BatchCreate): Batch {
    const status = 'queued'
    return new Batch(
      undefined,
      status,
      input.prompt,
      input.sampler,
      input.scheduler,
      input.steps,
      input.images,
      input.size,
      input.origin,
      input.modelName,
      input.negativePrompt
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
      input.createdAt,
      input.updatedAt
    )
  }

  async request (dimensions: ImageRequestedData['dimensions']): Promise<void> {
    if (!this.id) throw new BatchIdError()
    await this.notify(new ImageRequested({ batchId: this.id, dimensions }))
  }

  process (): void {
    this.status = 'processing'
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
}
