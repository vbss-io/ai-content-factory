import { type GetVideoFiltersQueryOutput } from './dto/GetVideoFiltersQuery.dto'

export interface GetVideoFiltersQuery {
  execute: () => Promise<GetVideoFiltersQueryOutput>
}
