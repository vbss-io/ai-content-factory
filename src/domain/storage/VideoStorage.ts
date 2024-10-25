export interface VideoStorage {
  uploadVideo: (base64Video: string) => Promise<string>
  deleteVideo: (filepath: string) => Promise<void>
}
