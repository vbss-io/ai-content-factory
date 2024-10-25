import { type InputValidate } from '@api/domain/validate/InputValidate'
import { type ZodSchema } from 'zod'

export class ZodAdapter<T> implements InputValidate<T> {
  constructor (private readonly schema: ZodSchema<T>) {}

  validate (value: T): T {
    return this.schema.parse(value)
  }
}
