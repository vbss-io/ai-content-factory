import mongoose, { type Document, type Model, Schema } from 'mongoose'

export interface UserDocument extends Document {
  username: string
  hash: string
  role: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    hash: { type: String, required: true },
    role: { type: String, required: true }
  },
  { timestamps: true, versionKey: false }
)

export const UserModel: Model<UserDocument> = mongoose.model<UserDocument>('User', UserSchema)
