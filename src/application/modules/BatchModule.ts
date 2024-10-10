import { BatchController } from '@/application/controllers/BatchController'
import { DeleteBatchById } from '@/application/usecases/DeleteBatchById'
import { GetBatchById } from '@/application/usecases/GetBatchById'
import { GetBatches } from '@/application/usecases/GetBatches'
import { Registry } from '@/infra/dependency-injection/Registry'
import { BatchRepositoryMongo } from '@/infra/mongodb/repository/BatchRepositoryMongo'
import { ByIdSchema } from '@/infra/schemas/ByIdSchema'
import { GetAllSchema } from '@/infra/schemas/GetAllSchema'
import { ZodAdapter } from '@/infra/validate/InputValidate'

export class BatchModule {
  constructor () {
    const byIdValidate = new ZodAdapter(ByIdSchema)
    const getAllValidate = new ZodAdapter(GetAllSchema)
    Registry.getInstance().provide('byIdValidate', byIdValidate)
    Registry.getInstance().provide('getAllValidate', getAllValidate)
    const batchRepository = new BatchRepositoryMongo()
    Registry.getInstance().provide('batchRepository', batchRepository)
    const getBatchById = new GetBatchById()
    const deleteBatchById = new DeleteBatchById()
    const getBatches = new GetBatches()
    Registry.getInstance().provide('getBatchById', getBatchById)
    Registry.getInstance().provide('deleteBatchById', deleteBatchById)
    Registry.getInstance().provide('getBatches', getBatches)
    new BatchController()
  }
}
