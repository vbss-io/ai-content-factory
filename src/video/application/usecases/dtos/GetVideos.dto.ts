import { type Video } from '@/video/domain/entities/Video'

export interface GetVideosInput {
  userId: string
  search_mask?: string
  aspectRatio?: string
  origin?: string
  modelName?: string
  page: number
}

export type GetVideosOutput = Array<Omit<Video, 'increaseLikes' | 'decreaseLikes'> & { userLiked: boolean }>
