import { inject } from '@/@api/infra/dependency-injection/Registry'
import { type Cron } from '@/@cron/domain/cron/Cron'
import { type CronJobRepository } from '@/@cron/domain/repositories/CronJobRepository'
import { CronNotFoundError, StartCronError } from '@/@cron/infra/errors/CronErrorCatalog'
import { type StartCronJobInput, type StartCronJobOutput } from './dtos/StartCronJob.dto'

export class StartCronJob {
  @inject('cronRepository')
  private readonly cronRepository!: CronJobRepository

  @inject('cron')
  private readonly cron!: Cron

  async execute (input: StartCronJobInput): Promise<StartCronJobOutput> {
    const cronJob = await this.cronRepository.getById(input.id, input.userId)
    if (!cronJob) throw new CronNotFoundError()
    if (cronJob.status === 'running') throw new StartCronError()
    cronJob.start()
    await this.cronRepository.update(cronJob)
    this.cron.startCronJob(cronJob.id)
    return {
      jobId: cronJob.id,
      status: cronJob.status
    }
  }
}
