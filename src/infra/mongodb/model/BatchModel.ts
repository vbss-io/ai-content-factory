import mongoose, { type Document, type Model, Schema } from 'mongoose'

export interface BatchDocument extends Document {
  status: string
  prompt: string
  negativePrompt?: string
  sampler: string
  scheduler: string
  steps: number
  modelName?: string
  images: string[]
  origin?: string
  size: number
  createdAt: Date
  updatedAt: Date
}

const BatchSchema: Schema = new Schema(
  {
    status: { type: String, required: true },
    prompt: { type: String, required: true },
    negativePrompt: { type: String },
    sampler: { type: String, required: true },
    scheduler: { type: String, required: true },
    steps: { type: Number, required: true },
    modelName: { type: String },
    images: { type: [String], required: true },
    origin: { type: String },
    size: { type: Number, required: true }
  },
  { timestamps: true, versionKey: false }
)

export const BatchModel: Model<BatchDocument> = mongoose.model<BatchDocument>('Batch', BatchSchema)
