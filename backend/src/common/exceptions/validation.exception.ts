import { HttpException, HttpStatus } from '@nestjs/common';

type ErrorObject = {
  code: string;
  message: string;
};

export class ValidationException extends HttpException {
  private readonly errorObject: ErrorObject;

  constructor(errorObject: ErrorObject) {
    super(errorObject, HttpStatus.BAD_REQUEST);
    this.errorObject = errorObject;
  }

  getResponse(): ErrorObject {
    return this.errorObject;
  }
}
