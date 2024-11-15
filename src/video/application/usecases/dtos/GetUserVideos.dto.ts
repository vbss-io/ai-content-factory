import { type Video } from '@/video/domain/entities/Video'

export interface GetUserVideosInput {
  userId: string
  page: number
}

export type GetUserVideosOutput = Array<Omit<Video, 'increaseLikes' | 'decreaseLikes'> & { userLiked: boolean }>
