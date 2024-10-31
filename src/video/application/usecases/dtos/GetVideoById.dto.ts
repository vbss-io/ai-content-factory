import { type Video } from '@/video/domain/entities/Video'

export interface GetVideoByIdInput {
  id: string
  username?: string
}

export type GetVideoByIdOutput = Omit<Video, 'increaseLikes' | 'decreaseLikes'> & {
  prompt: string
  negativePrompt: string
  origin: string
  modelName: string
  userLiked: boolean
  authorName: string
  automatic: boolean
  owner: boolean
}
