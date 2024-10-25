import { Registry } from '@/@api/infra/dependency-injection/Registry'
import { ZodAdapter } from '@/@api/infra/validate/ZodAdapter'
import { BatchController } from '@/application/controllers/BatchController'
import { DeleteBatchById } from '@/application/usecases/Batch/DeleteBatchById'
import { GetBatchById } from '@/application/usecases/Batch/GetBatchById'
import { GetBatches } from '@/application/usecases/Batch/GetBatches'
import { GetBatchFilters } from '@/application/usecases/Batch/GetBatchFilters'
import { GetBatchFiltersQueryMongo } from '@/infra/queries/GetBatchFiltersMongo'
import { BatchRepositoryMongo } from '@/infra/repositories/BatchRepositoryMongo'
import { ByIdSchema } from '@/infra/schemas/ByIdSchema'
import { GetAllSchema } from '@/infra/schemas/GetAllSchema'

export class BatchModule {
  constructor () {
    const byIdValidate = new ZodAdapter(ByIdSchema)
    const getAllValidate = new ZodAdapter(GetAllSchema)
    Registry.getInstance().provide('byIdValidate', byIdValidate)
    Registry.getInstance().provide('getAllValidate', getAllValidate)
    const batchRepository = new BatchRepositoryMongo()
    Registry.getInstance().provide('batchRepository', batchRepository)
    const getBatchFiltersQuery = new GetBatchFiltersQueryMongo()
    Registry.getInstance().provide('getBatchFiltersQuery', getBatchFiltersQuery)
    const getBatchById = new GetBatchById()
    const deleteBatchById = new DeleteBatchById()
    const getBatches = new GetBatches()
    const getBatchFilters = new GetBatchFilters()
    Registry.getInstance().provide('getBatchById', getBatchById)
    Registry.getInstance().provide('deleteBatchById', deleteBatchById)
    Registry.getInstance().provide('getBatches', getBatches)
    Registry.getInstance().provide('getBatchFilters', getBatchFilters)
    new BatchController()
  }
}
