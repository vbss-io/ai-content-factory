import { type Image } from '@/image/domain/entities/Image'

export interface GetImagesInput {
  userId: string
  search_mask?: string
  sampler?: string
  scheduler?: string
  aspectRatio?: string
  origin?: string
  modelName?: string
  page: number
}

export type GetImagesOutput = Array<Omit<Image, 'increaseLikes' | 'decreaseLikes'> & { userLiked: boolean }>
