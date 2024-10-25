import { type Image } from '@/domain/entities/Image'

export type GetRandomLandscapeImageOutput = Omit<Image, 'increaseLikes' | 'decreaseLikes'> & {
  prompt: string
  negativePrompt: string
  sampler: string
  scheduler: string
  steps: number
  origin: string
  modelName: string
}
