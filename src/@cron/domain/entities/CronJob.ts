import { Observable } from '@api/infra/events/Observer'
import { type CronJobCreate, type CronJobRestore, type CronJobUpdate } from './dtos/CronJob.dto'

export class CronJob extends Observable {
  id: string
  userId: string
  status: string
  cronTime: string
  customPrompt?: string
  customAspectRatio?: string
  genImages: boolean
  genVideos: boolean
  origins: string[]
  batches: string[]
  callback: () => void

  private constructor (
    id: string,
    userId: string,
    status: string,
    cronTime: string,
    genImages: boolean,
    genVideos: boolean,
    origins: string[],
    batches: string[],
    callback: () => void,
    customPrompt?: string,
    customAspectRatio?: string,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {
    super()
    this.id = id
    this.userId = userId
    this.status = status
    this.cronTime = cronTime
    this.customPrompt = customPrompt
    this.customAspectRatio = customAspectRatio
    this.genImages = genImages
    this.genVideos = genVideos
    this.origins = origins
    this.batches = batches
    this.callback = callback
  }

  static create (input: CronJobCreate): CronJob {
    if (!input.genImages && !input.genVideos) {
      throw new Error('genImages or genVideos must be true.')
    }
    if (!input.origins?.length) {
      throw new Error('Require at least 1 origin.')
    }
    // if (input.cronTime !== '0 */12 * * *') {
    //   throw new Error('Invalid cron time')
    // }
    const status = 'scheduled'
    return new CronJob(
      '',
      input.userId,
      status,
      input.cronTime,
      input.genImages,
      input.genVideos,
      input.origins,
      [],
      () => {},
      input.customPrompt,
      input.customAspectRatio
    )
  }

  static restore (input: CronJobRestore): CronJob {
    return new CronJob(
      input.id,
      input.userId,
      input.status,
      input.cronTime,
      input.genImages,
      input.genVideos,
      input.origins,
      input.batches,
      () => {},
      input.customPrompt,
      input.customAspectRatio,
      input.createdAt,
      input.updatedAt
    )
  }

  stop (): void {
    this.status = 'stopped'
  }

  start (): void {
    this.status = 'running'
  }

  update (input: CronJobUpdate): void {
    if (!input.genImages && !input.genVideos) {
      throw new Error('genImages or genVideos must be true.')
    }
    const genImages = input.genImages ?? false
    const genVideos = input.genVideos ?? false
    const cronTime = input.cronTime ?? this.cronTime
    const customPrompt = input.customPrompt ?? this.customPrompt
    const customAspectRatio = input.customAspectRatio ?? this.customAspectRatio
    const origins = input.origins ?? this.origins
    this.cronTime = cronTime
    this.customPrompt = customPrompt
    this.customAspectRatio = customAspectRatio
    this.genImages = genImages
    this.genVideos = genVideos
    this.origins = origins
  }

  addBatch (batchId: string): void {
    this.batches.push(batchId)
  }

  removeBatch (batchId: string): void {
    const newBatches = this.batches.filter((id) => id !== batchId)
    this.batches = newBatches
  }

  setCallback (callback: () => void): void {
    this.callback = callback
  }
}
