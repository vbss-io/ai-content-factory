import { z } from 'zod'

export const RequestVideoSchema = z.object({
  gateway: z.enum(['lumaLabs'], {
    required_error: 'gateway is required',
    message: 'gateway must be lumaLabs'
  }),
  prompt: z.string({
    required_error: 'prompt is required',
    invalid_type_error: 'prompt must be a string'
  }),
  imageId: z.string({
    invalid_type_error: 'imageId must be a string'
  }).optional(),
  aspectRatio: z.string({
    required_error: 'aspectRatio is required',
    invalid_type_error: 'aspectRatio must be a string'
  })
})

export type RequestVideoInput = z.infer<typeof RequestVideoSchema>
