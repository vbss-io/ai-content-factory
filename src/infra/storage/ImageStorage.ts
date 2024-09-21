import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

export interface ImageStorage {
  uploadImage: (base64Image: string) => Promise<string>
}

export class LocalImageStorageAdapter implements ImageStorage {
  private readonly uploadDir: string

  constructor () {
    this.uploadDir = path.resolve(__dirname, '../../../images')
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true })
    }
  }

  async uploadImage (base64Image: string): Promise<string> {
    const filename = crypto.randomUUID()
    const imageBuffer = Buffer.from(base64Image, 'base64')
    const finalFilename = `${filename}.png`
    const filePath = path.join(this.uploadDir, finalFilename)
    await fs.promises.writeFile(filePath, imageBuffer)
    return `/images/${finalFilename}`
  }
}
