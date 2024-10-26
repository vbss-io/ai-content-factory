import { type GetImageFiltersQueryOutput } from '@/image/domain/queries/dtos/GetImageFiltersQuery.dto'

export interface GetImageFiltersQuery {
  execute: () => Promise<GetImageFiltersQueryOutput>
}
