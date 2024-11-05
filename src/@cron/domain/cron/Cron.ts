import { type CronJob } from '@/@cron/domain/entities/CronJob'

export interface Cron {
  createCronJob: (cronJob: CronJob) => void
  startCronJob: (id: string) => void
  stopCronJob: (id: string) => void
  deleteCronJob: (id: string) => void
}
