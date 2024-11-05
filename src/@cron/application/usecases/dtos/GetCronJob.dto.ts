export interface GetCronJobInput {
  id: string
  userId: string
}

export interface GetCronJobOutput {
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
}
