import { inject } from '@/@api/infra/dependency-injection/Registry'
import { type GetBatchFiltersOutput } from '@/application/usecases/Batch/dtos/GetBatchFilters.dto'
import { type GetBatchFiltersQuery } from '@/domain/queries/GetBatchFiltersQuery'

export class GetBatchFilters {
  @inject('getBatchFiltersQuery')
  private readonly getBatchFiltersQuery!: GetBatchFiltersQuery

  async execute (): Promise<GetBatchFiltersOutput> {
    return await this.getBatchFiltersQuery.execute()
  }
}
