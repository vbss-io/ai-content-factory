export interface ImageCreate {
  width: number
  height: number
  seed: number
  info: string
}

export type ImageRestore = ImageCreate & {
  id: string
  createdAt: Date
  updatedAt: Date
}
