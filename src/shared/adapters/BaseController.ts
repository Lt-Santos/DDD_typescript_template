import { Request, Response } from "express";
import { CREATED, INTERNAL_SERVER_ERROR, OK } from "../constants/http";
import { AppError, isAppError } from "../core/errors/AppError";

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
  protected abstract executeImpl(req: Request, res: Response): Promise<void>;

  /**
   * Entry point for all controllers.
   * Wraps `executeImpl` with error catching to avoid unhandled exceptions.
   *
   * @param req - Express request object
   * @param res - Express response object
   */
  public execute = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.executeImpl(req, res);
    } catch (error) {
      console.error(`[BaseController]: Uncaught Error`, error);
      res.status(500).json({ message: "Unexpected Error Occured" });
      return;
    }
  };

  /**
   * Sends a JSON response with the given HTTP status code and message.
   *
   * @param res - Express response object
   * @param code - HTTP status code
   * @param message - Response message
   */
  public static jsonResponse(
    res: Response,
    code: number,
    message: string
  ): void {
    res.status(code).json({ message });
  }

  /**
   * Handles known application errors by sending the appropriate HTTP status and message.
   * Falls back to `fail` for unexpected errors.
   *
   * @param res - Express response object
   * @param error - AppError instance to handle
   */
  protected handleAppError(res: Response, error: AppError): void {
    if (isAppError(error)) {
      const status = error.statusCode || 500;
      const message = error.message;
      BaseController.jsonResponse(res, status, message);
      return;
    }
    this.fail(res, error);
  }

  /**
   * Sends a 200 OK response with optional payload.
   *
   * @param res - Express response object
   * @param dto - Optional response data to send
   */
  protected ok<T>(res: Response, dto?: T): void {
    if (dto) {
      res.status(OK).json(dto);
    } else {
      res.status(OK).send();
    }
  }

  /**
   * Sends a 201 Created response with no content.
   *
   * @param res - Express response object
   */
  protected created(res: Response): void {
    res.status(CREATED).send();
  }

  /**
   * Sends a 500 Internal Server Error response with the error message.
   *
   * @param res - Express response object
   * @param error - Error to send back to client
   */
  protected fail(res: Response, error: any): void {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: error instanceof Error ? error.message : error });
    return;
  }
}
