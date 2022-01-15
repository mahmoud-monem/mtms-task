export class BaseError extends Error {
  code: number;
  status: number;
  constructor(
    code = 0,
    name = 'UnexpectedError',
    status = 500,
    message = 'Internal server error',
  ) {
    super(message);

    this.code = code;
    this.name = name;
    this.status = status;
    this.message = message;
  }

  toJson() {
    return {
      error: this.name,
      message: this.message,
    };
  }
}

export class NotFoundError extends BaseError {
  constructor(message = 'Error 404') {
    super(0, 'NotFoundError', 404, message);
  }
}

export class UnauthenticatedError extends BaseError {
  constructor(message = 'Authentication failed') {
    super(0, 'UnauthenticatedError', 403, message);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message = 'Unauthorized Access') {
    super(0, 'UnauthorizedError', 401, message);
  }
}

export class ValidationError extends BaseError {
  errors: any;

  constructor(message = 'Bad Request', errors = null) {
    super(0, 'ValidationError', 400, message);
    this.errors = errors;
  }
}

export class MethodNotImplementedError extends BaseError {
  constructor(message = 'Method Not Implemented') {
    super(0, 'MethodNotImplementedError', 500, message);
  }
}

export class UnexpectedError extends BaseError {
  constructor(message = 'Unexpected Error') {
    super(0, 'UnexpectedError', 500, message);
  }
}
