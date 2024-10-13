import { z } from 'zod'

export const RequestImageSchema = z.object({
  gateway: z.enum(['automatic1111', 'goApiMidjourney', 'openAiDalle3'], {
    required_error: 'gateway is required',
    message: 'gateway must be automatic1111, goApiMidjourney or openAiDalle3'
  }),
  prompt: z.string({
    required_error: 'prompt is required',
    invalid_type_error: 'prompt must be a string'
  }),
  negative_prompt: z.string({
    invalid_type_error: 'negative_prompt must be a string'
  }).optional(),
  seed: z.number({
    invalid_type_error: 'negative_prompt must be a number'
  }).optional(),
  batch_size: z.number({
    invalid_type_error: 'batch_size must be a number'
  }).optional().default(1),
  steps: z.number({
    invalid_type_error: 'steps must be a number'
  }).optional().default(20),
  width: z.number({
    invalid_type_error: 'width must be a number'
  }).optional().default(512),
  height: z.number({
    invalid_type_error: 'height must be a number'
  }).optional().default(512),
  sampler_index: z.string({
    invalid_type_error: 'sampler_index must be a string'
  }).optional().default('DPM++ 2M'),
  scheduler: z.string({
    invalid_type_error: 'scheduler must be a string'
  }).optional().default('Karras')
})

export type RequestImageInput = z.infer<typeof RequestImageSchema>
