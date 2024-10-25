import { inject } from '@/@api/infra/dependency-injection/Registry'
import { type GetImageFiltersOutput } from '@/application/usecases/Image/dtos/GetImageFilters.dto'
import { type GetImageFiltersQuery } from '@/domain/queries/GetImageFiltersQuery'

export class GetImageFilters {
  @inject('getImageFiltersQuery')
  private readonly getImageFiltersQuery!: GetImageFiltersQuery

  async execute (): Promise<GetImageFiltersOutput> {
    return await this.getImageFiltersQuery.execute()
  }
}
