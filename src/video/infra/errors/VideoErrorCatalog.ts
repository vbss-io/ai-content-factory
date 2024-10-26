import { HttpStatusCodes } from '@api/domain/http/HttpStatusCodes'
import { CustomError } from '@api/infra/errors/CustomError'

export class ProcessVideoError extends CustomError {
  constructor (message: string) {
    super(HttpStatusCodes.BadRequest, message)
  }
}

export class VideoNotFoundError extends CustomError {
  constructor () {
    super(HttpStatusCodes.NotFound, 'Video Not found')
  }
}
