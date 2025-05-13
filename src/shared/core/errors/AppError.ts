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

/**
 * Base class for all application-specific errors.
 * Enforces the presence of a message and an HTTP status code.
 */
export abstract class AppError extends Error {
  /**
   * @param message - A descriptive message for the error.
   * @param statusCode - Corresponding HTTP status code for the error.
   */
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

/**
 * Type guard to determine if a value is an instance of AppError.
 *
 * @param error - The unknown error to check.
 * @returns True if the error is an AppError.
 */
export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};

/**
 * Represents a 400 Bad Request error.
 */
export class BadRequestError extends AppError {
  constructor(message = "Bad Request") {
    super(message, BAD_REQUEST);
  }
}

/**
 * Represents a 401 Unauthorized error.
 */
export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, UNAUTHORIZED);
  }
}

/**
 * Represents a 403 Forbidden error.
 */
export class ForbiddenError extends AppError {
  constructor(message = "Access to resource is restricted") {
    super(message, FORBIDDEN);
  }
}

/**
 * Represents a 404 Not Found error.
 */
export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, NOT_FOUND);
  }
}

/**
 * Represents a 409 Conflict error.
 */
export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, CONFLICT);
  }
}

/**
 * Represents a 422 Unprocessable Content error.
 */
export class UnproccessableContentError extends AppError {
  constructor(message = "Cannot be processed") {
    super(message, UNPROCESSABLE_CONTENT);
  }
}

/**
 * Represents a 429 Too Many Requests error.
 */
export class TooManyRequestsError extends AppError {
  constructor(message = "Too many requests at a time") {
    super(message, TOO_MANY_REQUESTS);
  }
}

/**
 * Represents a 422 Validation error.
 */
export class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, UNPROCESSABLE_CONTENT);
  }
}

/**
 * Represents a 409 Conflict error when an email is already taken.
 */
export class EmailAlreadyTakenError extends AppError {
  constructor(message = "Email is already taken") {
    super(message, CONFLICT);
  }
}

/**
 * Represents an unexpected internal server error (500).
 */
export class UnexpectedError extends AppError {
  constructor(message: string = "An unexpected error occurred") {
    super(message, INTERNAL_SERVER_ERROR);
  }

  /**
   * Factory method to convert unknown errors to UnexpectedError.
   *
   * @param error - The unknown error to convert.
   * @returns An instance of UnexpectedError.
   */
  static create(error: unknown): UnexpectedError {
    if (error instanceof Error) {
      return new UnexpectedError(error.message);
    }

    return new UnexpectedError(String(error));
  }
}
