import { z } from 'zod'

export const UploadAvatarSchema = z.object({
  files: z.array(z.any(), {
    required_error: 'files is required'
  }).min(1).max(1)
})

export type UploadAvatarInput = z.infer<typeof UploadAvatarSchema>
