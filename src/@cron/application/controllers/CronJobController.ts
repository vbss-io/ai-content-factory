import { type CreateCronJob } from '@/@cron/application/usecases/CreateCronJob'
import { type DeleteCronJob } from '@/@cron/application/usecases/DeleteCronJob'
import { type GetCronJob } from '@/@cron/application/usecases/GetCronJob'
import { type GetUserCronJobs } from '@/@cron/application/usecases/GetUserCronJobs'
import { type StartCronJob } from '@/@cron/application/usecases/StartCronJob'
import { type StopCronJob } from '@/@cron/application/usecases/StopCronJob'
import { type UpdateCronJob } from '@/@cron/application/usecases/UpdateCronJob'
import { type CreateCronJobInput } from '@/@cron/infra/schemas/CreateCronJobSchema'
import { type UpdateCronJobInput } from '@/@cron/infra/schemas/UpdateCronJobSchema'
import { type RequestFacade } from '@/auth/infra/facades/RequestFacade'
import { type HttpServer } from '@api/domain/http/HttpServer'
import { HttpStatusCodes } from '@api/domain/http/HttpStatusCodes'
import { type InputValidate } from '@api/domain/validate/InputValidate'
import { inject } from '@api/infra/dependency-injection/Registry'
import { type ByIdInput } from '@api/infra/schemas/ByIdSchema'

export class CronJobController {
  @inject('httpServer')
  private readonly httpServer!: HttpServer

  @inject('requestFacade')
  private readonly requestFacade!: RequestFacade

  @inject('createCronJobValidate')
  private readonly createCronJobValidate!: InputValidate<CreateCronJobInput>

  @inject('createCronJob')
  private readonly createCronJob!: CreateCronJob

  @inject('updateCronJobValidate')
  private readonly updateCronJobValidate!: InputValidate<UpdateCronJobInput>

  @inject('updateCronJob')
  private readonly updateCronJob!: UpdateCronJob

  @inject('byIdValidate')
  private readonly byIdValidate!: InputValidate<ByIdInput>

  @inject('getCronJob')
  private readonly getCronJob!: GetCronJob

  @inject('getUserCronJobs')
  private readonly getUserCronJobs!: GetUserCronJobs

  @inject('deleteCronJob')
  private readonly deleteCronJob!: DeleteCronJob

  @inject('startCronJob')
  private readonly startCronJob!: StartCronJob

  @inject('stopCronJob')
  private readonly stopCronJob!: StopCronJob

  constructor () {
    this.httpServer.register('post', '/cron', async (params: CreateCronJobInput) => {
      const user = this.requestFacade.getUser()
      const inputParsed = this.createCronJobValidate.validate(params)
      return await this.createCronJob.execute({ ...inputParsed, userId: user?.id as string })
    }, HttpStatusCodes.OK)

    this.httpServer.register('put', '/cron', async (params: UpdateCronJobInput) => {
      const user = this.requestFacade.getUser()
      const inputParsed = this.updateCronJobValidate.validate(params)
      return await this.updateCronJob.execute({ ...inputParsed, userId: user?.id as string })
    }, HttpStatusCodes.OK)

    this.httpServer.register('delete', '/cron', async (params: ByIdInput) => {
      const user = this.requestFacade.getUser()
      const inputParsed = this.byIdValidate.validate(params)
      await this.deleteCronJob.execute({ ...inputParsed, userId: user?.id as string })
    }, HttpStatusCodes.OK)

    this.httpServer.register('get', '/cron', async (params: ByIdInput) => {
      const user = this.requestFacade.getUser()
      const inputParsed = this.byIdValidate.validate(params)
      return await this.getCronJob.execute({ ...inputParsed, userId: user?.id as string })
    }, HttpStatusCodes.OK)

    this.httpServer.register('get', '/crons', async () => {
      const user = this.requestFacade.getUser()
      return await this.getUserCronJobs.execute({ userId: user?.id as string })
    }, HttpStatusCodes.OK)

    this.httpServer.register('patch', '/cron/start', async (params: ByIdInput) => {
      const user = this.requestFacade.getUser()
      const inputParsed = this.byIdValidate.validate(params)
      return await this.startCronJob.execute({ ...inputParsed, userId: user?.id as string })
    }, HttpStatusCodes.OK)

    this.httpServer.register('patch', '/cron/stop', async (params: ByIdInput) => {
      const user = this.requestFacade.getUser()
      const inputParsed = this.byIdValidate.validate(params)
      return await this.stopCronJob.execute({ ...inputParsed, userId: user?.id as string })
    }, HttpStatusCodes.OK)
  }
}
