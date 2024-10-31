import { ByIdSchema } from '@/@api/infra/schemas/ByIdSchema'
import { GetAllSchema } from '@/@api/infra/schemas/GetAllSchema'
import { BatchController } from '@/batch/application/controllers/BatchController'
import { DeleteBatchById } from '@/batch/application/usecases/DeleteBatchById'
import { GetBatchById } from '@/batch/application/usecases/GetBatchById'
import { GetBatches } from '@/batch/application/usecases/GetBatches'
import { GetBatchFilters } from '@/batch/application/usecases/GetBatchFilters'
import { GetBatchFiltersQueryMongo } from '@/batch/infra/queries/GetBatchFiltersMongo'
import { BatchRepositoryMongo } from '@/batch/infra/repositories/BatchRepositoryMongo'
import { CreateManualBatchSchema } from '@/batch/infra/schemas/CreateManualBatchSchema'
import { Registry } from '@api/infra/dependency-injection/Registry'
import { ZodAdapter } from '@api/infra/validate/ZodAdapter'
import { CreateManualBatch } from './usecases/CreateManualBatch'

export class BatchModule {
  constructor () {
    const byIdValidate = new ZodAdapter(ByIdSchema)
    const getAllValidate = new ZodAdapter(GetAllSchema)
    const createManualBatchValidate = new ZodAdapter(CreateManualBatchSchema)
    Registry.getInstance().provide('byIdValidate', byIdValidate)
    Registry.getInstance().provide('getAllValidate', getAllValidate)
    Registry.getInstance().provide('createManualBatchValidate', createManualBatchValidate)
    const batchRepository = new BatchRepositoryMongo()
    Registry.getInstance().provide('batchRepository', batchRepository)
    const getBatchFiltersQuery = new GetBatchFiltersQueryMongo()
    Registry.getInstance().provide('getBatchFiltersQuery', getBatchFiltersQuery)
    const getBatchById = new GetBatchById()
    const deleteBatchById = new DeleteBatchById()
    const getBatches = new GetBatches()
    const getBatchFilters = new GetBatchFilters()
    const createManualBatch = new CreateManualBatch()
    Registry.getInstance().provide('getBatchById', getBatchById)
    Registry.getInstance().provide('deleteBatchById', deleteBatchById)
    Registry.getInstance().provide('getBatches', getBatches)
    Registry.getInstance().provide('getBatchFilters', getBatchFilters)
    Registry.getInstance().provide('createManualBatch', createManualBatch)
    new BatchController()
  }
}
