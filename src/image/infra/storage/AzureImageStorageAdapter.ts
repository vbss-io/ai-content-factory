import { type ImageStorage } from '@/image/domain/storage/ImageStorage'
import { BlobServiceClient } from '@azure/storage-blob'
import crypto from 'crypto'

export class AzureImageStorageAdapter implements ImageStorage {
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
