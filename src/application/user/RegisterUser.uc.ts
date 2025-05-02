import { inject, injectable } from "tsyringe";
import "@/startup/container";
import EventBus from "@/shared/domain/EventBus";
import IHasher from "@/shared/domain/IHasher";
import IIdGenerator from "@/shared/domain/IIdGenerator";
import IUserRepository from "@/domain/user/IUserRepository";
import User from "@/domain/user/User";
import Result from "@/shared/core/Result";
import { EmailAlreadyTakenError } from "@/shared/core/errors/AppError";
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
    @inject(EventBus) private readonly eventBus: EventBus,
    @inject(TOKENS.IIdGenerator.key) private readonly idGen: IIdGenerator
  ) {}

  public async execute(dto: RegisterUserDTO) {
    const existingUser = await this.userRepo.existsByEmail(dto.email);
    if (existingUser) {
      return Result.fail(new EmailAlreadyTakenError());
    }
    const userId = this.idGen.generate();
    return (await User.register(userId, dto.email, dto.password, this.hasher))
      .asyncMap(async (user) => {
        await this.userRepo.save(user);
        this.eventBus.publish(user.pullDomainEvents());
      })
      .execute();
  }
}

export default RegisterUserUseCase;
