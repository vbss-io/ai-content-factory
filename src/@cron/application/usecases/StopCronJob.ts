import { inject } from '@/@api/infra/dependency-injection/Registry'
import { type Cron } from '@/@cron/domain/cron/Cron'
import { type CronJobRepository } from '@/@cron/domain/repositories/CronJobRepository'
import { CronNotFoundError, StopCronError } from '@/@cron/infra/errors/CronErrorCatalog'
import { type StopCronJobInput, type StopCronJobOutput } from './dtos/StopCronJob.dto'

export class StopCronJob {
  @inject('cronRepository')
  private readonly cronRepository!: CronJobRepository

  @inject('cron')
  private readonly cron!: Cron

  async execute (input: StopCronJobInput): Promise<StopCronJobOutput> {
    const cronJob = await this.cronRepository.getById(input.id, input.userId)
    if (!cronJob) throw new CronNotFoundError()
    if (cronJob.status === 'stopped') throw new StopCronError()
    cronJob.stop()
    await this.cronRepository.update(cronJob)
    this.cron.stopCronJob(cronJob.id)
    return {
      jobId: cronJob.id,
      status: cronJob.status
    }
  }
}
