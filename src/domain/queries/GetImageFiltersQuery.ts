import { type GetImageFiltersQueryOutput } from '@/domain/queries/dto/GetImageFiltersQuery.dto'

export interface GetImageFiltersQuery {
  execute: () => Promise<GetImageFiltersQueryOutput>
}
