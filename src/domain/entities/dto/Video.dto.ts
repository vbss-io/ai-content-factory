export interface VideoCreate {
  width: number
  height: number
  path: string
  batchId: string
}

export type VideoRestore = VideoCreate & {
  id: string
  aspectRatio: string
  likes: number
  createdAt: Date
  updatedAt: Date
}
