import { type GetBatchFiltersOutput } from '@/batch/application/usecases/dtos/GetBatchFilters.dto'
import { type GetBatchFiltersQuery } from '@/batch/domain/queries/GetBatchFiltersQuery'
import { inject } from '@api/infra/dependency-injection/Registry'

export class GetBatchFilters {
  @inject('getBatchFiltersQuery')
  private readonly getBatchFiltersQuery!: GetBatchFiltersQuery

  async execute (): Promise<GetBatchFiltersOutput> {
    return await this.getBatchFiltersQuery.execute()
  }
}
