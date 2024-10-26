import { ByIdSchema } from '@/@api/infra/schemas/ByIdSchema'
import { GetAllSchema } from '@/@api/infra/schemas/GetAllSchema'
import { BatchController } from '@/batch/application/controllers/BatchController'
import { DeleteBatchById } from '@/batch/application/usecases/DeleteBatchById'
import { GetBatchById } from '@/batch/application/usecases/GetBatchById'
import { GetBatches } from '@/batch/application/usecases/GetBatches'
import { GetBatchFilters } from '@/batch/application/usecases/GetBatchFilters'
import { GetBatchFiltersQueryMongo } from '@/batch/infra/queries/GetBatchFiltersMongo'
import { BatchRepositoryMongo } from '@/batch/infra/repositories/BatchRepositoryMongo'
import { Registry } from '@api/infra/dependency-injection/Registry'
import { ZodAdapter } from '@api/infra/validate/ZodAdapter'

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
