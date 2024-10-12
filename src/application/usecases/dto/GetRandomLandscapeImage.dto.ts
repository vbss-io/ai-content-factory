import { type Image } from '@/domain/entities/Image'

export type GetRandomLandscapeImageOutput = Image & {
  prompt: string
  negativePrompt: string
  sampler: string
  scheduler: string
  steps: number
  origin: string
  modelName: string
}
