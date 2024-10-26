export interface GetBatchesInput {
  search_mask?: string
  sampler?: string
  scheduler?: string
  status?: string
  origin?: string
  modelName?: string
  page: number
}

export type GetBatchesOutput = Array<{
  id: string
  images: string[]
  videos: string[]
  modelName: string
  negativePrompt: string
  origin: string
  prompt: string
  sampler: string
  scheduler: string
  size: number
  status: string
  steps: number
  createdAt?: Date
  updatedAt?: Date
}>
