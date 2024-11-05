import { type CronJob } from '@/@cron/domain/entities/CronJob'

export interface CronJobRepository {
  create: (cronJob: CronJob) => Promise<CronJob>
  getById: (id: string, userId: string) => Promise<CronJob | undefined>
  update: (cronJob: CronJob) => Promise<void>
  deleteById: (id: string) => Promise<void>
  getAllByStatus: (status: string) => Promise<CronJob[] | []>
  getAll: (userId: string) => Promise<CronJob[] | []>
}
