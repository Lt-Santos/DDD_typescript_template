import { container } from "tsyringe";
import RegisterUserUseCase from "@/application/user/RegisterUser.uc";
import RegisterUserController from "../controllers/registerUser.controller";

export const makeRegisterUserController = (): RegisterUserController => {
  const useCase = container.resolve(RegisterUserUseCase);
  return new RegisterUserController(useCase);
};

export const registerUserHandler = makeRegisterUserController().execute;
