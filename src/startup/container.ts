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

container.registerSingleton("EventBus", EventBus);
container.registerSingleton("EmailService", ConsoleEmailService);
container.registerSingleton<IIdGenerator>("IIdGenerator", UuidGenerator);
container.register<IUserRepository>("IUserRepository", MongoUserRepository);
container.register<IHasher>("IHasher", BcryptHasher);

const eventBus = container.resolve<EventBus>("EventBus");
const emailService = container.resolve<ConsoleEmailService>("EmailService");

eventBus.register("UserRegisteredEvent", handleUserRegistered(emailService));
