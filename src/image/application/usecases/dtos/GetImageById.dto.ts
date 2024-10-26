import { type Image } from '@/image/domain/entities/Image'

export interface GetImageByIdInput {
  id: string
  username?: string
}

export type GetImageByIdOutput = Omit<Image, 'increaseLikes' | 'decreaseLikes'> & {
  prompt: string
  negativePrompt: string
  sampler: string
  scheduler: string
  steps: number
  origin: string
  modelName: string
  userLiked: boolean
}
