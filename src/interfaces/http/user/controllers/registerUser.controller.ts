import { container } from "tsyringe";
import { HttpRequest, HttpResponse } from "@/shared/adapters/HttpTypes";
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
  async executeImpl(req: HttpRequest): Promise<HttpResponse> {
    const { email, password } = req.body;
    const result = await this.registerUserUseCase.execute({ email, password });

    if (result.isFail()) {
      return this.handleAppError(result.getError());
    }

    return this.created();
  }
}

export default RegisterUserController;
