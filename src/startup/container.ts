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

container.register("EventBus", { useClass: EventBus });
container.register("EmailService", { useClass: ConsoleEmailService });
container.register<IIdGenerator>("IIdGenerator", {
  useClass: UuidGenerator,
});
container.register<IUserRepository>("IUserRepository", {
  useClass: MongoUserRepository,
});
container.register<IHasher>("IHasher", {
  useClass: BcryptHasher,
});

const eventBus = container.resolve(EventBus);
const emailService = container.resolve<ConsoleEmailService>("EmailService");

eventBus.register("UserRegisteredEvent", handleUserRegistered(emailService));
