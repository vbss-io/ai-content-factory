import { type Image } from '@/domain/entities/Image'

export interface ImageRepository {
  create: (image: Image) => Promise<Image>
}
