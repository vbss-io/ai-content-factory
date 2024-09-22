export interface BatchCreate {
  prompt: string
  negativePrompt?: string
  sampler: string
  scheduler: string
  steps: number
  modelName?: string
  images: string[]
  origin?: string
  size: number
}

export type BatchRestore = BatchCreate & {
  id: string
  status: string
  createdAt: Date
  updatedAt: Date
}

export interface BatchProcessUpdate {
  origin: string
  modelName: string
}
