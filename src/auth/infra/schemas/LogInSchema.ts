import { z } from 'zod'

export const LogInSchema = z.object({
  username: z.string({
    required_error: 'username is required',
    invalid_type_error: 'username must be a string'
  }).min(5, {
    message: 'username must have a minimum length of 5'
  }),
  password: z.string({
    required_error: 'password is required',
    invalid_type_error: 'password must be a string'
  }).min(5, {
    message: 'password must have a minimum length of 5'
  })
})

export type LogInInput = z.infer<typeof LogInSchema>
