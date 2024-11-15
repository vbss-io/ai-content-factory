export interface UploadAvatarInput {
  userId: string
  files: File[]
}

export interface UploadAvatarOutput {
  path: string
}
