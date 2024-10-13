import { type Image } from '@/domain/entities/Image'

export interface GetImageByIdInput {
  id: string
}

export type GetImageByIdOutput = Image & {
  prompt: string
  negativePrompt: string
  sampler: string
  scheduler: string
  steps: number
  origin: string
  modelName: string
}
