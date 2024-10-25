import { type VideoStorage } from '@/domain/storage/VideoStorage'
import { BlobServiceClient } from '@azure/storage-blob'
import crypto from 'crypto'

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
