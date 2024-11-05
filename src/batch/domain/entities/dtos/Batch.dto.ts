export interface BatchCreate {
  prompt: string
  negativePrompt?: string
  sampler: string
  scheduler: string
  steps: number
  size: number
  author: string
  authorName: string
  automatic: boolean
}

export type BatchRestore = BatchCreate & {
  id: string
  status: string
  origin: string
  modelName: string
  negativePrompt: string
  errorMessage: string
  type: string
  taskId: string
  images: string[]
  videos: string[]
  createdAt: Date
  updatedAt: Date
}

export interface BatchProcessUpdate {
  origin: string
  modelName: string
}

export interface BatchConfigurationInput {
  sampler: string
  scheduler: string
  steps: number
  size: number
  negativePrompt?: string
  width: number
  height: number
}

export interface BatchConfigurationOutput {
  sampler: string
  scheduler: string
  steps: number
  size: number
  negativePrompt?: string
}