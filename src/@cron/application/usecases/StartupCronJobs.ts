import { inject } from '@/@api/infra/dependency-injection/Registry'
import { type Cron } from '@/@cron/domain/cron/Cron'
import { type CronJobRepository } from '@/@cron/domain/repositories/CronJobRepository'

export class StartupCronJobs {
  @inject('cronRepository')
  private readonly cronRepository!: CronJobRepository

  @inject('cron')
  private readonly cron!: Cron

  async execute (): Promise<void> {
    const cronJobs = await this.cronRepository.getAllByStatus('running')
    for (const cronJob of cronJobs) {
      cronJob.setCallback(() => { console.log(`cron ${cronJob.id} startup`) })
      this.cron.createCronJob(cronJob)
    }
  }
}
