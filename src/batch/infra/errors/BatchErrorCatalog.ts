import { HttpStatusCodes } from '@api/domain/http/HttpStatusCodes'
import { CustomError } from '@api/infra/errors/CustomError'

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

export class FailedToParseSizesError extends CustomError {
  constructor (message: string) {
    super(HttpStatusCodes.NotFound, `Failed to parse JSON stringified sizes: ${message}`)
  }
}

export class FailedToConvertBatchFile extends CustomError {
  constructor (message: string) {
    super(HttpStatusCodes.NotFound, `Failed to convert Batch: ${message}`)
  }
}
