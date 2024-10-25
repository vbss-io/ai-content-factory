import { type GetVideoFiltersQueryOutput } from '@/domain/queries/dtos/GetVideoFiltersQuery.dto'

export interface GetVideoFiltersQuery {
  execute: () => Promise<GetVideoFiltersQueryOutput>
}
