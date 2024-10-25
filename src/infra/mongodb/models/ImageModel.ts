import mongoose, { type Document, type Model, Schema } from 'mongoose'

export interface ImageDocument extends Document {
  width: number
  height: number
  aspectRatio: string
  seed: number
  path: string
  batchId: string
  likes: number
  createdAt: Date
  updatedAt: Date
}

const ImageSchema: Schema = new Schema(
  {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    aspectRatio: { type: String, required: true },
    seed: { type: String, required: true },
    path: { type: String, required: true },
    batchId: { type: Schema.ObjectId, ref: 'Batch' },
    likes: { type: Number, required: true, default: 0 }
  },
  { timestamps: true, versionKey: false }
)

export const ImageModel: Model<ImageDocument> = mongoose.model<ImageDocument>('Image', ImageSchema)
