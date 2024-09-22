import { CustomError } from '@/infra/error/CustomError'
import { HttpStatusCodes } from '@/infra/http/HttpStatusCodes'

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
    super(HttpStatusCodes.InternalServerError, 'Batch Not found')
  }
}

export class ImagineGatewayError extends CustomError {
  constructor () {
    super(HttpStatusCodes.InternalServerError, 'Error to Imagine')
  }
}
export class NotFoundError extends CustomError {
  constructor () {
    super(HttpStatusCodes.NotFound, 'Not found')
  }
}
