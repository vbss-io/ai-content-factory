import mongoose, { type Document, type Model, Schema } from 'mongoose'

export interface ImageDocument extends Document {
  prompt: string
  width: number
  height: number
  createdAt: Date
  updatedAt: Date
}

const ImageSchema: Schema = new Schema(
  {
    prompt: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true }
  },
  { timestamps: true, versionKey: false }
)

export const ImageModel: Model<ImageDocument> = mongoose.model<ImageDocument>('Image', ImageSchema)
