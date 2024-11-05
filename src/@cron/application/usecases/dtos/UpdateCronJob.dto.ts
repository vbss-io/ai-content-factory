import { type UpdateCronJobInput as UpdateCronJobSchemaInput } from '@/@cron/infra/schemas/UpdateCronJobSchema'

export type UpdateCronJobInput = UpdateCronJobSchemaInput & {
  userId: string
}

export interface UpdateCronJobOutput {
  jobId: string
  status: string
}
