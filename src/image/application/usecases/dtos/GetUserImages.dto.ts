import { type Image } from '@/image/domain/entities/Image'

export interface GetUserImagesInput {
  userId: string
  page: number
}

export type GetUserImagesOutput = Array<Omit<Image, 'increaseLikes' | 'decreaseLikes'> & { userLiked: boolean }>
