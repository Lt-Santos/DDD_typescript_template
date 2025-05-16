import { container } from "tsyringe";
import RegisterUserUseCase from "@/application/user/RegisterUser.uc";
import RegisterUserController from "./controllers/registerUser.controller";

/**
 * Factory function that creates and returns an instance of RegisterUserController.
 *
 * @returns A new instance of RegisterUserController.
 */
export const makeRegisterUserController = (): RegisterUserController => {
  const useCase = container.resolve(RegisterUserUseCase);
  return new RegisterUserController(useCase);
};
