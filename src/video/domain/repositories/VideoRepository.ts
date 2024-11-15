import { type Video } from '@/video/domain/entities/Video'

export interface VideoRepository {
  create: (video: Video) => Promise<Video>
  getVideoById: (id: string) => Promise<Video | undefined>
  getVideosByIds: (ids: string[]) => Promise<Video[] | []>
  getVideos: (page: number, searchMask?: string, aspectRatio?: string, origin?: string, modelName?: string) => Promise<Video[]>
  getUserVideos: (page: number, userId: string) => Promise<Video[]>
  update: (video: Video) => Promise<void>
  deleteById: (id: string) => Promise<void>
}
