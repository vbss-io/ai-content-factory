import { type CreateCronJobInput as CreateCronJobSchemaInput } from '@/@cron/infra/schemas/CreateCronJobSchema'

export type CreateCronJobInput = CreateCronJobSchemaInput & {
  userId: string
}

export interface CreateCronJobOutput {
  jobId: string
  status: string
}
