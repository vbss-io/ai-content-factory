import { NotImplemented } from '@/infra/error/ErrorCatalog'
import { BlobServiceClient } from '@azure/storage-blob'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

export interface VideoStorage {
  uploadVideo: (base64Video: string) => Promise<string>
  deleteVideo: (filepath: string) => Promise<void>
}

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

export class AzureVideoStorageAdapter implements VideoStorage {
  protected connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING as string
  protected containerName = process.env.AZURE_STORAGE_CONTAINER_NAME as string

  async uploadVideo (base64Video: string): Promise<string> {
    const blobServiceClient = BlobServiceClient.fromConnectionString(this.connectionString)
    const containerClient = blobServiceClient.getContainerClient(this.containerName)
    const filename = crypto.randomUUID()
    const finalFilename = `${filename}.mp4`
    const blockBlobClient = containerClient.getBlockBlobClient(finalFilename)
    const videoBuffer = Buffer.from(base64Video, 'base64')
    await blockBlobClient.upload(
      videoBuffer,
      Buffer.byteLength(videoBuffer)
    )
    return `/${this.containerName}/${finalFilename}`
  }

  async deleteVideo (filepath: string): Promise<void> {
    const blobServiceClient = BlobServiceClient.fromConnectionString(this.connectionString)
    const containerClient = blobServiceClient.getContainerClient(this.containerName)
    const filename = filepath.replace(`/${this.containerName}/`, '')
    const blockBlobClient = containerClient.getBlockBlobClient(filename)
    await blockBlobClient.deleteIfExists({
      deleteSnapshots: 'include'
    })
  }
}
