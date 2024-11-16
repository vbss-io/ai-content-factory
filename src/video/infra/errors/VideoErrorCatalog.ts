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

export class LumaLabsDimensionsError extends CustomError {
  constructor () {
    super(HttpStatusCodes.BadRequest, 'Luma Labs aspectRatios allowed: 1:1, 16:9, 9:16, 4:3, 3:4, 21:9 or 9:21')
  }
}
