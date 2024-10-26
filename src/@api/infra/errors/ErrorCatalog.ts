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

export class DatabaseConnectionCloseError extends CustomError {
  constructor () {
    super(HttpStatusCodes.InternalServerError, 'Database Connection Close Error')
  }
}

export class QueueConnectionError extends CustomError {
  constructor () {
    super(HttpStatusCodes.InternalServerError, 'Queue Connection Error')
  }
}

export class GatewayNotImplemented extends CustomError {
  constructor () {
    super(HttpStatusCodes.NotFound, 'Gateway Not Implemented')
  }
}
