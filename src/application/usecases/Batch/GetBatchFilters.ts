import { type GetBatchFiltersOutput } from '@/application/usecases/Batch/dto/GetBatchFilters.dto'
import { type GetBatchFiltersQuery } from '@/domain/queries/GetBatchFiltersQuery'
import { inject } from '@/infra/dependency-injection/Registry'

export class GetBatchFilters {
  @inject('getBatchFiltersQuery')
  private readonly getBatchFiltersQuery!: GetBatchFiltersQuery

  async execute (): Promise<GetBatchFiltersOutput> {
    return await this.getBatchFiltersQuery.execute()
  }
}
