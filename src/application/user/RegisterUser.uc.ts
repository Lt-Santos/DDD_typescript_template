import { inject, injectable } from "tsyringe";
import "@/shared/startup/container";
import type IHasher from "@/shared/domain/IHasher";
import type IIdGenerator from "@/shared/domain/IIdGenerator";
import type IUserRepository from "@/domain/user/IUserRepository";
import type IEventBus from "@/shared/domain/IEventBus";
import User from "@/domain/user/User";
import Result from "@/shared/core/Result";
import { EmailAlreadyTakenError } from "@/shared/core/errors/AppError";
import TOKENS from "@/infrastructure/ioc/tokens";
import { RegisterUserType } from "@/domain/user/User.types";

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

  public async execute(dto: RegisterUserDTO) {
    if (await this.userAlreadyExists(dto.email)) {
      return Result.fail(new EmailAlreadyTakenError());
    }
    return await this.executeUserRegistration(dto);
  }

  private async executeUserRegistration(dto: RegisterUserDTO) {
    const userId = this.idGen.generate();
    const result = await (
      await this.createUserDomainEntity({
        id: userId,
        emailStr: dto.email,
        rawPassword: dto.password,
        hasher: this.hasher,
      })
    )
      .onSuccessAsync(
        async (user) => await this.saveUserToDbAndPublishEvent(user)
      )
      .execute();
    return result;
  }

  private async saveUserToDbAndPublishEvent<E extends Error>(user: User) {
    try {
      await this.userRepo.save(user);
      this.eventBus.publish(user.pullDomainEvents());
      return Result.ok();
    } catch (error) {
      return Result.fail(error as E);
    }
  }

  private async createUserDomainEntity(userOptions: RegisterUserType) {
    return await User.register(userOptions);
  }

  private async userAlreadyExists(email: string) {
    return await this.userRepo.existsByEmail(email);
  }
}

export default RegisterUserUseCase;
