export interface GetBatchesInput {
  search_mask?: string
  sampler?: string
  scheduler?: string
  status?: string
  origin?: string
  modelName?: string
  userId: string
  page: number
}

export type GetBatchesMedias = Array<{
  id: string
  path: string
}>

export type GetBatchesOutput = Array<{
  id: string
  images: GetBatchesMedias
  videos: GetBatchesMedias
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
