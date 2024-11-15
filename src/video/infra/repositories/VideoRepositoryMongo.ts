import { Video } from '@/video/domain/entities/Video'
import { type VideoRepository } from '@/video/domain/repositories/VideoRepository'
import { type VideoDocument, VideoModel } from '@/video/infra/mongoose/VideoModel'
import { type PipelineStage, Types } from 'mongoose'

export class VideoRepositoryMongo implements VideoRepository {
  async create (video: Video): Promise<Video> {
    const videoDoc = new VideoModel({
      width: video.width,
      height: video.height,
      aspectRatio: video.aspectRatio,
      path: video.path,
      batchId: new Types.ObjectId(video.batchId)
    })
    const savedDoc = await videoDoc.save()
    return this.toDomain(savedDoc)
  }

  async update (video: Video): Promise<void> {
    const { id, ...rest } = video
    await VideoModel.findByIdAndUpdate(id, { ...rest }, { new: true }).exec()
  }

  async deleteById (id: string): Promise<void> {
    await VideoModel.findOneAndDelete({ _id: id })
  }

  async getVideoById (id: string): Promise<Video | undefined> {
    const videoDoc = await VideoModel.findById(id)
    if (!videoDoc) return
    return this.toDomain(videoDoc)
  }

  async getVideosByIds (ids: string[]): Promise<Video[] | []> {
    const findOptions = { _id: { $in: ids } }
    const videoDocs = await VideoModel.find(findOptions)
    return videoDocs.map((videoDoc) => {
      return this.toDomain(videoDoc)
    })
  }

  async getVideos (page: number, searchMask?: string, aspectRatio?: string, origin?: string, modelName?: string): Promise<Video[]> {
    const pageSize = 25
    const offset = (page - 1) * pageSize
    const aggregateOptions: PipelineStage[] = [
      {
        $lookup: {
          from: 'batches',
          localField: 'batchId',
          foreignField: '_id',
          as: 'batch'
        }
      },
      {
        $unwind: {
          path: '$batch',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'batch.author',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true
        }
      }
    ]
    if (searchMask) {
      const regex = new RegExp(`${searchMask}`, 'i')
      aggregateOptions.push({
        $match: {
          $or: [
            { 'batch.prompt': regex },
            { 'batch.negativePrompt': regex }
          ]
        }
      })
    }
    if (aspectRatio) aggregateOptions.push({ $match: { aspectRatio } })
    if (origin) aggregateOptions.push({ $match: { 'batch.origin': origin } })
    if (modelName) aggregateOptions.push({ $match: { 'batch.modelName': modelName } })
    const videoDocs = await VideoModel.aggregate(aggregateOptions).sort({ likes: -1, _id: -1 }).skip(offset).limit(pageSize)
    return videoDocs.map((videoDoc) => {
      const doc = { ...videoDoc, authorName: videoDoc.user?.username, authorAvatar: videoDoc.user?.avatar }
      return this.toDomain(doc as VideoDocument)
    })
  }

  async getUserVideos (page: number, userId: string): Promise<Video[]> {
    const pageSize = 25
    const offset = (page - 1) * pageSize
    const aggregateOptions: PipelineStage[] = [
      {
        $lookup: {
          from: 'batches',
          localField: 'batchId',
          foreignField: '_id',
          as: 'batch'
        }
      },
      {
        $unwind: {
          path: '$batch',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'batch.author',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true
        }
      },
      { $match: { 'batch.author': new Types.ObjectId(userId) } }
    ]
    const videoDocs = await VideoModel.aggregate(aggregateOptions).sort({ likes: -1, _id: -1 }).skip(offset).limit(pageSize)
    return videoDocs.map((videoDoc) => {
      const doc = { ...videoDoc, authorName: videoDoc.user?.username, authorAvatar: videoDoc.user?.avatar }
      return this.toDomain(doc as VideoDocument)
    })
  }

  private toDomain (videoDoc: VideoDocument): Video {
    const id = videoDoc._id as any
    return Video.restore({
      id: id.toString(),
      width: videoDoc.width,
      height: videoDoc.height,
      aspectRatio: videoDoc.aspectRatio,
      path: videoDoc.path,
      batchId: String(videoDoc.batchId),
      likes: videoDoc?.likes ?? 0,
      authorName: videoDoc.authorName,
      authorAvatar: videoDoc.authorAvatar,
      createdAt: new Date(videoDoc.createdAt),
      updatedAt: new Date(videoDoc.updatedAt)
    })
  }
}
