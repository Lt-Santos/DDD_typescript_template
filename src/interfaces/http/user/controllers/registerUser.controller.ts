import { container } from "tsyringe";
import { Request, Response } from "express";
import RegisterUserUseCase from "@/application/user/RegisterUser.uc";
import { BaseController } from "@/shared/adapters/BaseController";

/**
 * Controller for handling user registration HTTP requests.
 */
class RegisterUserController extends BaseController {
  constructor(
    private registerUserUseCase = container.resolve(RegisterUserUseCase)
  ) {
    super();
  }

  /**
   * Executes the registration flow by invoking the use case and sending appropriate HTTP responses.
   *
   * @param req - Express HTTP request object, expecting `email` and `password` in body.
   * @param res - Express HTTP response object.
   */
  async executeImpl(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const result = await this.registerUserUseCase.execute({ email, password });

    if (result.isFail()) {
      this.handleAppError(res, result.getError());
      return;
    }

    this.created(res);
  }
}

export default RegisterUserController;
