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

/**
 * Registers the EventBus implementation as a singleton in the DI container.
 */
container.registerSingleton<IEventBus>(TOKENS.IEventBus.key, EventBus);

/**
 * Registers the ConsoleEmailService as the implementation for EmailService.
 * This is typically used for local/testing environments.
 */
container.registerSingleton<EmailService>(
  TOKENS.EmailService.key,
  ConsoleEmailService
);

/**
 * Registers UuidGenerator as the implementation for generating unique IDs.
 */
container.registerSingleton<IIdGenerator>(
  TOKENS.IIdGenerator.key,
  UuidGenerator
);

/**
 * Registers MongoUserRepository as the IUserRepository implementation.
 */
container.registerSingleton<IUserRepository>(
  TOKENS.IUserRepository.key,
  MongoUserRepository
);

/**
 * Registers BcryptHasher as the implementation of the IHasher interface.
 */
container.registerSingleton<IHasher>(TOKENS.IHasher.key, BcryptHasher);

/**
 * Resolves the EventBus and ConsoleEmailService from the container.
 * Registers the UserRegisteredEvent with its handler.
 */
const eventBus = container.resolve(EventBus);
const emailService = container.resolve(ConsoleEmailService);

/**
 * Registers a handler for the UserRegisteredEvent.
 */
eventBus.register(UserRegisteredEvent, handleUserRegistered(emailService));
