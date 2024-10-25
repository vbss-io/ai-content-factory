import { type GetImageFiltersQueryOutput } from '@/domain/queries/dtos/GetImageFiltersQuery.dto'

export interface GetImageFiltersQuery {
  execute: () => Promise<GetImageFiltersQueryOutput>
}
