import { type GetImageFiltersOutput } from '@/image/application/usecases/dtos/GetImageFilters.dto'
import { type GetImageFiltersQuery } from '@/image/domain/queries/GetImageFiltersQuery'
import { inject } from '@api/infra/dependency-injection/Registry'

export class GetImageFilters {
  @inject('getImageFiltersQuery')
  private readonly getImageFiltersQuery!: GetImageFiltersQuery

  async execute (): Promise<GetImageFiltersOutput> {
    return await this.getImageFiltersQuery.execute()
  }
}
