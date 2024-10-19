import { type Image } from '@/domain/entities/Image'

export interface ImageRepository {
  create: (image: Image) => Promise<Image>
  update: (image: Image) => Promise<void>
  deleteById: (id: string) => Promise<void>
  getImageById: (id: string) => Promise<Image | undefined>
  getImages: (page: number, searchMask?: string, sampler?: string, scheduler?: string, aspectRatio?: string, origin?: string, modelName?: string) => Promise<Image[]>
  getRandomLandscapeImage: () => Promise<Image | undefined>
  getImagesByIds: (ids: string[]) => Promise<Image[] | []>
}
