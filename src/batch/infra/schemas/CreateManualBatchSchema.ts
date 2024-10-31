import { FailedToParseSizesError } from '@/batch/infra/errors/BatchErrorCatalog'
import { z } from 'zod'

export const CreateManualBatchSchema = z.object({
  prompt: z.string({
    required_error: 'prompt is required',
    invalid_type_error: 'prompt must be a string'
  }),
  negative_prompt: z.string({
    invalid_type_error: 'negative_prompt must be a string'
  }).optional().default('none'),
  origin: z.string({
    required_error: 'origin is required',
    invalid_type_error: 'origin must be a string'
  }),
  model_name: z.string({
    required_error: 'model_name is required',
    invalid_type_error: 'model_name must be a string'
  }),
  sizes: z.string({
    required_error: 'sizes is required',
    invalid_type_error: 'sizes must be a JSON stringified [{ "filename": { "width": 1080, "height": 1920 } }]'
  }),
  files: z.array(z.any()).optional().default([]),
  images: z.array(z.any()).optional().default([]),
  videos: z.array(z.any()).optional().default([])
}).superRefine((val, ctx) => {
  console.log('val', val)
  if (!val.images.length && !val.videos.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'At least one file (image or video) is required'
    })
  }
  if (val.images.length + val.videos.length > 4) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Maximum number of files is 4'
    })
  }
  try {
    const files = [...val.images, ...val.videos]
    const sizes = JSON.parse(val.sizes)
    files.forEach((file) => {
      const size = sizes[file.originalname]
      if (!size?.width || !size?.height) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Cannot find size for ${file.originalname}`
        })
      }
    })
  } catch (error: any) {
    throw new FailedToParseSizesError(error.message as string)
  }
})

export type CreateManualBatchInput = z.infer<typeof CreateManualBatchSchema>
