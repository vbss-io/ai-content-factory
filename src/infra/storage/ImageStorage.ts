import { NotImplemented } from '@/infra/error/ErrorCatalog'
import { BlobServiceClient } from '@azure/storage-blob'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

export interface ImageStorage {
  uploadImage: (base64Image: string) => Promise<string>
  deleteImage: (filepath: string) => Promise<void>
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

  async deleteImage (filepath: string): Promise<void> {
    throw new NotImplemented()
  }
}

export class AzureStorageAdapter implements ImageStorage {
  protected connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING as string
  protected containerName = process.env.AZURE_STORAGE_CONTAINER_NAME as string

  async uploadImage (base64Image: string): Promise<string> {
    const blobServiceClient = BlobServiceClient.fromConnectionString(this.connectionString)
    const containerClient = blobServiceClient.getContainerClient(this.containerName)
    const filename = crypto.randomUUID()
    const finalFilename = `${filename}.png`
    const blockBlobClient = containerClient.getBlockBlobClient(finalFilename)
    const imageBuffer = Buffer.from(base64Image, 'base64')
    await blockBlobClient.upload(
      imageBuffer,
      Buffer.byteLength(imageBuffer)
    )
    return `/${this.containerName}/${finalFilename}`
  }

  async deleteImage (filepath: string): Promise<void> {
    const blobServiceClient = BlobServiceClient.fromConnectionString(this.connectionString)
    const containerClient = blobServiceClient.getContainerClient(this.containerName)
    const filename = filepath.replace(`/${this.containerName}/`, '')
    const blockBlobClient = containerClient.getBlockBlobClient(filename)
    await blockBlobClient.deleteIfExists({
      deleteSnapshots: 'include'
    })
  }
}
