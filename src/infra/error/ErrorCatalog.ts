import { CustomError } from '@/infra/error/CustomError'
import { HttpStatusCodes } from '@/infra/http/HttpStatusCodes'

export class NotFoundError extends CustomError {
  constructor () {
    super(HttpStatusCodes.NotFound, 'Not found')
  }
}
