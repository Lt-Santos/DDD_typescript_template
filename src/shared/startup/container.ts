import { container } from "tsyringe";
import EventBus from "@/shared/domain/EventBus";
import ConsoleEmailService from "@/infrastructure/email/ConsoleEmailService";
import handleUserRegistered from "@/infrastructure/email/UseRegisteredHandler";
import IIdGenerator from "@/shared/domain/IIdGenerator";
import UuidGenerator from "@/infrastructure/utils/UuidGenerator";
import IUserRepository from "@/domain/user/IUserRepository";
import MongoUserRepository from "@/infrastructure/user/repositories/MongoUserRepository";
import IHasher from "@/shared/domain/IHasher";
import BcryptHasher from "@/infrastructure/crypto/BcryptHasher";
import UserRegisteredEvent from "@/domain/user/events/UserRegisteredEvent";
import EmailService from "@/infrastructure/email/EmailService";
import TOKENS from "@/infrastructure/ioc/tokens";
import IEventBus from "../domain/IEventBus";

container.registerSingleton<IEventBus>(TOKENS.IEventBus.key, EventBus);
container.registerSingleton<EmailService>(
  TOKENS.EmailService.key,
  ConsoleEmailService
);
container.registerSingleton<IIdGenerator>(
  TOKENS.IIdGenerator.key,
  UuidGenerator
);
container.registerSingleton<IUserRepository>(
  TOKENS.IUserRepository.key,
  MongoUserRepository
);
container.registerSingleton<IHasher>(TOKENS.IHasher.key, BcryptHasher);

const eventBus = container.resolve(EventBus);
const emailService = container.resolve(ConsoleEmailService);

eventBus.register(UserRegisteredEvent, handleUserRegistered(emailService));
