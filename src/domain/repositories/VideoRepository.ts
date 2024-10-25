import { type Video } from '@/domain/entities/Video'

export interface VideoRepository {
  create: (video: Video) => Promise<Video>
  update: (video: Video) => Promise<void>
  deleteById: (id: string) => Promise<void>
  getVideoById: (id: string) => Promise<Video | undefined>
  getVideos: (page: number, searchMask?: string, aspectRatio?: string, origin?: string, modelName?: string) => Promise<Video[]>
  getVideosByIds: (ids: string[]) => Promise<Video[] | []>
}
