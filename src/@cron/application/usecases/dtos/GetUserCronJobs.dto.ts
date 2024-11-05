export interface GetUserCronJobsInput {
  userId: string
}

export type GetUserCronJobsOutput = Array<{
  id: string
  userId: string
  status: string
  cronTime: string
  customPrompt: string
  customAspectRatio: string
  genImages: boolean
  genVideos: boolean
  origins: string[]
  batches: string[]
}>
