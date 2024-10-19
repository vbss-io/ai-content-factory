import { type GetImageFiltersOutput } from '@/application/usecases/Image/dto/GetImageFilters.dto'
import { type GetImageFiltersQuery } from '@/domain/queries/GetImageFiltersQuery'
import { inject } from '@/infra/dependency-injection/Registry'

export class GetImageFilters {
  @inject('getImageFiltersQuery')
  private readonly getImageFiltersQuery!: GetImageFiltersQuery

  async execute (): Promise<GetImageFiltersOutput> {
    return await this.getImageFiltersQuery.execute()
  }
}
