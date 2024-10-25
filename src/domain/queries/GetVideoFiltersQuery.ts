import { type GetVideoFiltersQueryOutput } from '@/domain/queries/dto/GetVideoFiltersQuery.dto'

export interface GetVideoFiltersQuery {
  execute: () => Promise<GetVideoFiltersQueryOutput>
}
