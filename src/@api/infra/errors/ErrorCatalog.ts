import { HttpStatusCodes } from '@api/domain/http/HttpStatusCodes'
import { CustomError } from '@api/infra/errors/CustomError'

export class NotFoundError extends CustomError {
  constructor () {
    super(HttpStatusCodes.NotFound, 'Not Found')
  }
}

export class NotImplemented extends CustomError {
  constructor () {
    super(HttpStatusCodes.NotFound, 'Not Implemented')
  }
}

export class DatabaseConnectionError extends CustomError {
  constructor () {
    super(HttpStatusCodes.InternalServerError, 'Database Connection Error')
  }
}

export class QueueConnectionError extends CustomError {
  constructor () {
    super(HttpStatusCodes.InternalServerError, 'Queue Connection Error')
  }
}

export class BatchIdError extends CustomError {
  constructor () {
    super(HttpStatusCodes.InternalServerError, 'Cannot process batch without Id')
  }
}

export class BatchNotFoundError extends CustomError {
  constructor () {
    super(HttpStatusCodes.NotFound, 'Batch Not found')
  }
}

export class ImagineGatewayError extends CustomError {
  constructor () {
    super(HttpStatusCodes.InternalServerError, 'Error to Imagine')
  }
}

export class GatewayNotImplemented extends CustomError {
  constructor () {
    super(HttpStatusCodes.NotFound, 'Gateway Not Implemented')
  }
}

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

export class DifferentPasswordAndConfirmation extends CustomError {
  constructor () {
    super(HttpStatusCodes.BadRequest, 'password and confirmPassword must be equals')
  }
}

export class UserAlreadyExist extends CustomError {
  constructor () {
    super(HttpStatusCodes.BadRequest, 'username already exists')
  }
}

export class UserAuthenticationError extends CustomError {
  constructor () {
    super(HttpStatusCodes.BadRequest, 'wrong username or password')
  }
}

export class MissingAuthorizationToken extends CustomError {
  constructor () {
    super(HttpStatusCodes.Unauthorized, 'Missing Authorization Token')
  }
}

export class NotAllowedError extends CustomError {
  constructor () {
    super(HttpStatusCodes.Unauthorized, 'Not Allowed Error')
  }
}

export class AuthError extends CustomError {
  constructor (message: string) {
    super(HttpStatusCodes.Unauthorized, message)
  }
}

export class DalleDimensionsError extends CustomError {
  constructor () {
    super(HttpStatusCodes.BadRequest, 'Dalle dimension allowed: 1024x1024, 1024x1792 or 1792x1024')
  }
}

export class PromptGenerationError extends CustomError {
  constructor () {
    super(HttpStatusCodes.BadRequest, 'Error to generate prompt')
  }
}

export class UserNotSet extends CustomError {
  constructor () {
    super(HttpStatusCodes.BadRequest, 'Cannot access user')
  }
}

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
