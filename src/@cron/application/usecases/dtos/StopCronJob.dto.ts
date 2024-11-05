export interface StopCronJobInput {
  id: string
  userId: string
}

export interface StopCronJobOutput {
  jobId: string
  status: string
}
