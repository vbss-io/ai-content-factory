import mongoose, { type Document, type Model, Schema } from 'mongoose'

export interface ImageDocument extends Document {
  width: number
  height: number
  seed: number
  info: string
  path: string
  createdAt: Date
  updatedAt: Date
}

const ImageSchema: Schema = new Schema(
  {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    seed: { type: String, required: true },
    info: { type: String, required: true },
    path: { type: String, required: true }
  },
  { timestamps: true, versionKey: false }
)

export const ImageModel: Model<ImageDocument> = mongoose.model<ImageDocument>('Image', ImageSchema)
