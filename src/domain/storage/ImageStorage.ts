export interface ImageStorage {
  uploadImage: (base64Image: string) => Promise<string>
  deleteImage: (filepath: string) => Promise<void>
}
