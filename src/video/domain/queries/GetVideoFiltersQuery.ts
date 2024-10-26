import { type GetVideoFiltersQueryOutput } from '@/video/domain/queries/dtos/GetVideoFiltersQuery.dto'

export interface GetVideoFiltersQuery {
  execute: () => Promise<GetVideoFiltersQueryOutput>
}
