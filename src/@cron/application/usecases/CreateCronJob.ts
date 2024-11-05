import { inject } from '@/@api/infra/dependency-injection/Registry'
import { type Cron } from '@/@cron/domain/cron/Cron'
import { CronJob } from '@/@cron/domain/entities/CronJob'
import { type CronJobRepository } from '@/@cron/domain/repositories/CronJobRepository'
import { type CreateCronJobInput, type CreateCronJobOutput } from './dtos/CreateCronJob.dto'

export class CreateCronJob {
  @inject('cronRepository')
  private readonly cronRepository!: CronJobRepository

  @inject('cron')
  private readonly cron!: Cron

  async execute (input: CreateCronJobInput): Promise<CreateCronJobOutput> {
    const cronJob = CronJob.create({
      userId: input.userId,
      cronTime: input.cronTime,
      customPrompt: input.customPrompt,
      customAspectRatio: input.customAspectRatio,
      genImages: input.genImages,
      genVideos: input.genVideos,
      origins: input.origins
    })
    cronJob.start()
    const repositoryCronJob = await this.cronRepository.create(cronJob)
    repositoryCronJob.setCallback(() => { console.log(`cron ${repositoryCronJob.id} created`) })
    this.cron.createCronJob(repositoryCronJob)
    return {
      jobId: repositoryCronJob.id,
      status: repositoryCronJob.status
    }
  }
}
