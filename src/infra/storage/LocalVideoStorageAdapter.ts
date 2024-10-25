import { type VideoStorage } from '@/domain/storage/VideoStorage'
import { NotImplemented } from '@/infra/errors/ErrorCatalog'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

export class LocalVideoStorageAdapter implements VideoStorage {
  private readonly uploadDir: string

  constructor () {
    this.uploadDir = path.resolve(__dirname, '../../../videos')
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true })
    }
  }

  async uploadVideo (base64Video: string): Promise<string> {
    const filename = crypto.randomUUID()
    const videoBuffer = Buffer.from(base64Video, 'base64')
    const finalFilename = `${filename}.mp4`
    const filePath = path.join(this.uploadDir, finalFilename)
    await fs.promises.writeFile(filePath, videoBuffer)
    return `/videos/${finalFilename}`
  }

  async deleteVideo (filepath: string): Promise<void> {
    throw new NotImplemented()
  }
}
