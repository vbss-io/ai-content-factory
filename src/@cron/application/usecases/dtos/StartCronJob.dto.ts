export interface StartCronJobInput {
  id: string
  userId: string
}

export interface StartCronJobOutput {
  jobId: string
  status: string
}
