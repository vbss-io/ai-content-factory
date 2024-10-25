import { inject } from '@/@api/infra/dependency-injection/Registry'
import { type GetVideoFiltersOutput } from '@/application/usecases/Video/dtos/GetVideoFilters.dto'
import { type GetVideoFiltersQuery } from '@/domain/queries/GetVideoFiltersQuery'

export class GetVideoFilters {
  @inject('getVideoFiltersQuery')
  private readonly getVideoFiltersQuery!: GetVideoFiltersQuery

  async execute (): Promise<GetVideoFiltersOutput> {
    return await this.getVideoFiltersQuery.execute()
  }
}
