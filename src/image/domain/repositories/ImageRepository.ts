import { type Image } from '@/image/domain/entities/Image'

export interface ImageRepository {
  create: (image: Image) => Promise<Image>
  getImageById: (id: string) => Promise<Image | undefined>
  getImagesByIds: (ids: string[]) => Promise<Image[] | []>
  getImages: (page: number, userId?: string, searchMask?: string, sampler?: string, scheduler?: string, aspectRatio?: string, origin?: string, modelName?: string) => Promise<Image[]>
  getRandomLandscapeImage: () => Promise<Image | undefined>
  update: (image: Image) => Promise<void>
  deleteById: (id: string) => Promise<void>
}
