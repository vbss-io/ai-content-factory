import { inject } from '@/@api/infra/dependency-injection/Registry'
import { type Cron } from '@/@cron/domain/cron/Cron'
import { type CronJobRepository } from '@/@cron/domain/repositories/CronJobRepository'
import { CronNotFoundError } from '@/@cron/infra/errors/CronErrorCatalog'
import { type DeleteCronJobInput } from './dtos/DeleteCronJob.dto'

export class DeleteCronJob {
  @inject('cronRepository')
  private readonly cronRepository!: CronJobRepository

  @inject('cron')
  private readonly cron!: Cron

  async execute (input: DeleteCronJobInput): Promise<void> {
    const cronJob = await this.cronRepository.getById(input.id, input.userId)
    if (!cronJob) throw new CronNotFoundError()
    this.cron.deleteCronJob(cronJob.id)
    await this.cronRepository.deleteById(input.id)
  }
}
