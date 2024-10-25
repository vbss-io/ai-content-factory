import { type Video } from '@/domain/entities/Video'

export interface GetVideosInput {
  search_mask?: string
  aspectRatio?: string
  origin?: string
  modelName?: string
  page: number
}

export type GetVideosOutput = Video[]
