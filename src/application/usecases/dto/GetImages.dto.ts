import { type Image } from '@/domain/entities/Image'

export interface GetImagesInput {
  search_mask?: string
  page: number
}

export type GetImagesOutput = Image[]
