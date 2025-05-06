import { container } from "tsyringe";
import { Request, Response } from "express";
import RegisterUserUseCase from "@/application/user/RegisterUser.uc";
import { BaseController } from "@/shared/adapters/BaseController";

class RegisterUserController extends BaseController {
  constructor(
    private registerUserUseCase = container.resolve(RegisterUserUseCase)
  ) {
    super();
  }

  async executeImpl(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const result = await this.registerUserUseCase.execute({ email, password });
    if (result.isFail()) {
      this.handleAppError(res, result.getError());
      return;
    }

    this.created(res);
    return;
  }
}

export default RegisterUserController;
