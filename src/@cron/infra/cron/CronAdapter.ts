import { type Cron } from '@/@cron/domain/cron/Cron'
import { type CronJob as CronJobEntity } from '@/@cron/domain/entities/CronJob'
import { CronTaskNotFoundError } from '@/@cron/infra/errors/CronErrorCatalog'
import { CronJob } from 'cron'

export class CronAdapter implements Cron {
  private readonly cronJobs = new Map<string, CronJob>()

  createCronJob (cronJob: CronJobEntity): void {
    const task = CronJob.from({
      cronTime: cronJob.cronTime,
      onTick: cronJob.callback,
      start: false,
      timeZone: 'America/Sao_Paulo'
    })
    this.cronJobs.set(cronJob.id, task)
    task.start()
  }

  startCronJob (id: string): void {
    const task = this.cronJobs.get(id)
    if (!task) throw new CronTaskNotFoundError()
    task.start()
  }

  stopCronJob (id: string): void {
    const task = this.cronJobs.get(id)
    if (!task) throw new CronTaskNotFoundError()
    task.stop()
  }

  deleteCronJob (id: string): void {
    const task = this.cronJobs.get(id)
    if (!task) throw new CronTaskNotFoundError()
    task.stop()
    this.cronJobs.delete(id)
  }
}
