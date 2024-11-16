export interface VideoCreate {
  width: number
  height: number
  aspectRatio: string
  path: string
  batchId: string
}

export type VideoRestore = VideoCreate & {
  id: string
  aspectRatio: string
  likes: number
  authorName: string
  authorAvatar: string
  createdAt: Date
  updatedAt: Date
}
