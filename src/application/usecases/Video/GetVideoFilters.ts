import { type GetVideoFiltersQuery } from '@/domain/queries/GetVideoFiltersQuery'
import { inject } from '@/infra/dependency-injection/Registry'
import { type GetVideoFiltersOutput } from './dto/GetVideoFilters.dto'

export class GetVideoFilters {
  @inject('getVideoFiltersQuery')
  private readonly getVideoFiltersQuery!: GetVideoFiltersQuery

  async execute (): Promise<GetVideoFiltersOutput> {
    return await this.getVideoFiltersQuery.execute()
  }
}
