import mongoose, { type Document, type Model, Schema } from 'mongoose'

export interface CronJobDocument extends Document {
  userId: string
  status: string
  cronTime: string
  customPrompt: string
  customAspectRatio: string
  genImages: boolean
  genVideos: boolean
  origins: string[]
  batches: string[]
  createdAt: Date
  updatedAt: Date
}

const CronJobSchema: Schema = new Schema(
  {
    userId: { type: Schema.ObjectId, required: true, ref: 'User' },
    status: { type: String, required: true },
    cronTime: { type: String, required: true },
    customPrompt: { type: String, required: true, default: '' },
    customAspectRatio: { type: String, required: true, default: '' },
    genImages: { type: Boolean, required: true, default: false },
    genVideos: { type: Boolean, required: true, default: false },
    origins: { type: [String], required: true, default: [] },
    batches: { type: [String], required: true, default: [] }
  },
  { timestamps: true, versionKey: false }
)

export const CronJobModel: Model<CronJobDocument> = mongoose.model<CronJobDocument>('CronJob', CronJobSchema)
