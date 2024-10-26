import { z } from 'zod'

export const RequestVideoSchema = z.object({
  gateway: z.enum(['LumaLabs'], {
    required_error: 'gateway is required',
    message: 'gateway must be LumaLabs'
  }),
  prompt: z.string({
    required_error: 'prompt is required',
    invalid_type_error: 'prompt must be a string'
  }),
  imageId: z.string({
    invalid_type_error: 'imageId must be a string'
  }).optional(),
  width: z.number({
    invalid_type_error: 'width must be a number'
  }).optional().default(512),
  height: z.number({
    invalid_type_error: 'height must be a number'
  }).optional().default(512)
})

export type RequestVideoInput = z.infer<typeof RequestVideoSchema>
