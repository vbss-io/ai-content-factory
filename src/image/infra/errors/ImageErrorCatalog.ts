import { HttpStatusCodes } from '@api/domain/http/HttpStatusCodes'
import { CustomError } from '@api/infra/errors/CustomError'

export class ProcessImageError extends CustomError {
  constructor (message: string) {
    super(HttpStatusCodes.BadRequest, message)
  }
}

export class ImageNotFoundError extends CustomError {
  constructor () {
    super(HttpStatusCodes.NotFound, 'Image Not found')
  }
}

export class DalleDimensionsError extends CustomError {
  constructor () {
    super(HttpStatusCodes.BadRequest, 'Dalle dimension allowed: 1024x1024, 1024x1792 or 1792x1024')
  }
}
