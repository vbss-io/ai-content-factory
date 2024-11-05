export interface CronJobCreate {
  userId: string
  cronTime: string
  customPrompt?: string
  customAspectRatio?: string
  genImages: boolean
  genVideos: boolean
  origins: string[]
}

export type CronJobRestore = CronJobCreate & {
  id: string
  status: string
  batches: string[]
  createdAt: Date
  updatedAt: Date
}

export interface CronJobUpdate {
  cronTime?: string
  customPrompt?: string
  customAspectRatio?: string
  genImages?: boolean
  genVideos?: boolean
  origins?: string[]
}
