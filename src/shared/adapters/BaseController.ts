import { CREATED, INTERNAL_SERVER_ERROR, OK } from "../constants/http";
import { AppError, isAppError } from "../core/errors/AppError";
import { HttpRequest, HttpResponse } from "./HttpTypes";

/**
 * Abstract base controller class to handle common patterns across all controllers.
 * Provides error handling, standard response helpers, and a consistent controller entry point.
 */
export abstract class BaseController {
  /**
   * Implement this method in a subclass to define specific request handling logic.
   *
   * @param req - Express request object
   * @param res - Express response object
   */
  protected abstract executeImpl(req: HttpRequest): Promise<HttpResponse>;

  /**
   * Entry point for all controllers.
   * Wraps `executeImpl` with error catching to avoid unhandled exceptions.
   *
   * @param req - Express request object
   * @param res - Express response object
   */
  public execute = async (req: HttpRequest): Promise<HttpResponse> => {
    try {
      return await this.executeImpl(req);
    } catch (error) {
      console.error(`[BaseController]: Uncaught Error`, error);
      return {
        statusCode: INTERNAL_SERVER_ERROR,
        body: { message: "Unexpected Error Occurred" },
      };
    }
  };

  /**
   * Handles known application errors by sending the appropriate HTTP status and message.
   * Falls back to `fail` for unexpected errors.
   *
   * @param res - Express response object
   * @param error - AppError instance to handle
   */
  protected handleAppError(error: AppError): HttpResponse {
    if (isAppError(error)) {
      const status = error.statusCode || 500;
      const message = error.message;
      return { statusCode: status, body: { message } };
    }
    return this.fail(error);
  }

  /**
   * Sends a 200 OK response with optional payload.
   *
   * @param res - Express response object
   * @param dto - Optional response data to send
   */
  protected ok<T>(dto?: T): HttpResponse {
    return {
      statusCode: OK,
      body: dto,
    };
  }

  /**
   * Sends a 201 Created response with no content.
   *
   * @param res - Express response object
   */
  protected created(): HttpResponse {
    return { statusCode: CREATED };
  }

  /**
   * Sends a 500 Internal Server Error response with the error message.
   *
   * @param res - Express response object
   * @param error - Error to send back to client
   */
  protected fail(error: any): HttpResponse {
    return {
      statusCode: INTERNAL_SERVER_ERROR,
      body: {
        message: error instanceof Error ? error.message : error,
      },
    };
  }
}
