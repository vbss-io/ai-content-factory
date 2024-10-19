import { type Image } from '@/domain/entities/Image'

export interface GetImagesInput {
  search_mask?: string
  sampler?: string
  scheduler?: string
  aspectRatio?: string
  origin?: string
  modelName?: string
  page: number
}

export type GetImagesOutput = Image[]
