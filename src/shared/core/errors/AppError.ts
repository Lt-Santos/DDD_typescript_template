import {
  BAD_REQUEST,
  CONFLICT,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
  UNPROCESSABLE_CONTENT,
} from "@/shared/constants/http";

export abstract class AppError extends Error {
  protected constructor(
    public readonly message: string,
    public readonly statusCode: number
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};
export class BadRequestError extends AppError {
  constructor(message = "Bad Request") {
    super(message, BAD_REQUEST);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, UNAUTHORIZED);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Access to resource is restricted") {
    super(message, FORBIDDEN);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, NOT_FOUND);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, CONFLICT);
  }
}

export class UnproccessableContentError extends AppError {
  constructor(message = "Cannot be processed") {
    super(message, UNPROCESSABLE_CONTENT);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = "Too many requests at a time") {
    super(message, TOO_MANY_REQUESTS);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, UNPROCESSABLE_CONTENT);
  }
}

export class EmailAlreadyTakenError extends AppError {
  constructor(message = "Email is already taken") {
    super(message, CONFLICT);
  }
}

export class UnexpectedError extends AppError {
  constructor(message: string = "An unexpected error occured") {
    super(message, INTERNAL_SERVER_ERROR);
  }

  static create(error: unknown): UnexpectedError {
    if (error instanceof Error) {
      return new UnexpectedError(error.message);
    }

    return new UnexpectedError(String(error));
  }
}
