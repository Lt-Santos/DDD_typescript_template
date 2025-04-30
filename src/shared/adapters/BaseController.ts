import { Request, Response } from "express";
import { CREATED, INTERNAL_SERVER_ERROR, OK } from "../constants/http";
import { AppError, isAppError } from "../core/errors/AppError";
export abstract class BaseController {
  protected abstract executeImpl(req: Request, res: Response): Promise<void>;
  public execute = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.executeImpl(req, res);
    } catch (error) {
      console.error(`[BaseController]: Uncaught Error`, error);
      res.status(500).json({ message: "Unexpected Error Occured" });
      return;
    }
  };

  public static jsonResponse(
    res: Response,
    code: number,
    message: string
  ): void {
    res.status(code).json({ message });
  }

  protected handleAppError(res: Response, error: AppError): void {
    if (isAppError(error)) {
      const status = error.statusCode || 500;
      const message = error.message;
      BaseController.jsonResponse(res, status, message);
      return;
    }
    this.fail(res, error);
  }

  protected ok<T>(res: Response, dto?: T): void {
    if (dto) {
      res.status(OK).json(dto);
    } else {
      res.status(OK).send();
    }
  }
  protected created(res: Response): void {
    res.status(CREATED).send();
  }

  protected fail(res: Response, error: any): void {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: error instanceof Error ? error.message : error });
    return;
  }
}
