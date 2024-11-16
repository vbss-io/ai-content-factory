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

export class Automatic1111DimensionsError extends CustomError {
  constructor () {
    super(HttpStatusCodes.BadRequest, 'Automatic1111 aspectRatios allowed: 1:1, 9:16, 16:9')
  }
}

export class DalleDimensionsError extends CustomError {
  constructor () {
    super(HttpStatusCodes.BadRequest, 'Dalle 3 aspectRatios allowed: 1:1, 9:16, 16:9')
  }
}

export class MidjourneyDimensionsError extends CustomError {
  constructor () {
    super(HttpStatusCodes.BadRequest, 'Midjourney aspectRatios allowed: 1:1, 9:16, 16:9')
  }
}
