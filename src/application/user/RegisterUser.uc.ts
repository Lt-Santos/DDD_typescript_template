import { inject, injectable } from "tsyringe";
import "@/shared/startup/container";
import type IHasher from "@/shared/domain/IHasher";
import type IIdGenerator from "@/shared/domain/IIdGenerator";
import type IUserRepository from "@/domain/user/IUserRepository";
import type IEventBus from "@/shared/domain/IEventBus";
import User from "@/domain/user/User";
import Result from "@/shared/core/Result";
import {
  AppError,
  EmailAlreadyTakenError,
  ValidationError,
} from "@/shared/core/errors/AppError";
import TOKENS from "@/infrastructure/ioc/tokens";

interface RegisterUserDTO {
  email: string;
  password: string;
}

@injectable()
class RegisterUserUseCase {
  constructor(
    @inject(TOKENS.IUserRepository.key) private userRepo: IUserRepository,
    @inject(TOKENS.IHasher.key) private readonly hasher: IHasher,
    @inject(TOKENS.IEventBus.key) private readonly eventBus: IEventBus,
    @inject(TOKENS.IIdGenerator.key) private readonly idGen: IIdGenerator
  ) {}

  public async execute(
    dto: RegisterUserDTO
  ): Promise<Result<void, ValidationError | AppError>> {
    if (await this.userAlreadyExists(dto.email)) {
      return Result.fail(new EmailAlreadyTakenError());
    }

    return this.executeUserRegistration(dto);
  }

  private async executeUserRegistration(
    dto: RegisterUserDTO
  ): Promise<Result<void, ValidationError | AppError>> {
    const userId = this.idGen.generate();
    return User.register({
      id: userId,
      emailStr: dto.email,
      rawPassword: dto.password,
      hasher: this.hasher,
    })
      .onSuccessAsync((user) => this.saveUserToDbAndPublishEvent(user))
      .execute();
  }

  private async saveUserToDbAndPublishEvent(
    user: User
  ): Promise<Result<void, AppError>> {
    try {
      await this.userRepo.save(user);
      this.eventBus.publish(user.pullDomainEvents());
      return Result.ok();
    } catch (err) {
      return Result.fail(err as AppError);
    }
  }

  private async userAlreadyExists(email: string): Promise<boolean> {
    return this.userRepo.existsByEmail(email);
  }
}

export default RegisterUserUseCase;
