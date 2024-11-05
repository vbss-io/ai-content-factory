import { ZodAdapter } from '@/@api/infra/validate/ZodAdapter'
import { CronAdapter } from '@/@cron/infra/cron/CronAdapter'
import { CronJobRepositoryMongo } from '@/@cron/infra/repositories/CronJobRepositoryMongo'
import { CreateCronJobSchema } from '@/@cron/infra/schemas/CreateCronJobSchema'
import { UpdateCronJobSchema } from '@/@cron/infra/schemas/UpdateCronJobSchema'
import { Registry } from '@api/infra/dependency-injection/Registry'
import { CronJobController } from './controllers/CronJobController'
import { CreateCronJob } from './usecases/CreateCronJob'
import { DeleteCronJob } from './usecases/DeleteCronJob'
import { GetCronJob } from './usecases/GetCronJob'
import { GetUserCronJobs } from './usecases/GetUserCronJobs'
import { StartCronJob } from './usecases/StartCronJob'
import { StartupCronJobs } from './usecases/StartupCronJobs'
import { StopCronJob } from './usecases/StopCronJob'
import { UpdateCronJob } from './usecases/UpdateCronJob'

export class CronJobModule {
  constructor () {
    const createCronJobValidate = new ZodAdapter(CreateCronJobSchema)
    const updateCronJobValidate = new ZodAdapter(UpdateCronJobSchema)
    Registry.getInstance().provide('createCronJobValidate', createCronJobValidate)
    Registry.getInstance().provide('updateCronJobValidate', updateCronJobValidate)
    const cronRepository = new CronJobRepositoryMongo()
    Registry.getInstance().provide('cronRepository', cronRepository)
    const cron = new CronAdapter()
    Registry.getInstance().provide('cron', cron)
    const createCronJob = new CreateCronJob()
    const getCronJob = new GetCronJob()
    const getUserCronJobs = new GetUserCronJobs()
    const updateCronJob = new UpdateCronJob()
    const deleteCronJob = new DeleteCronJob()
    const startCronJob = new StartCronJob()
    const stopCronJob = new StopCronJob()
    Registry.getInstance().provide('createCronJob', createCronJob)
    Registry.getInstance().provide('getCronJob', getCronJob)
    Registry.getInstance().provide('getUserCronJobs', getUserCronJobs)
    Registry.getInstance().provide('updateCronJob', updateCronJob)
    Registry.getInstance().provide('deleteCronJob', deleteCronJob)
    Registry.getInstance().provide('startCronJob', startCronJob)
    Registry.getInstance().provide('stopCronJob', stopCronJob)
    const startupCronJobs = new StartupCronJobs()
    void startupCronJobs.execute()
    new CronJobController()
  }
}
