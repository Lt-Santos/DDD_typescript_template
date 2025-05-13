import Email from "./valueObjects/Email";
import Password from "./valueObjects/Password";
import IHasher from "../../shared/domain/IHasher";
import UserRegisteredEvent from "./events/UserRegisteredEvent";
import { AppError, ValidationError } from "@/shared/core/errors/AppError";
import {
  PipeResult,
  combinePipeResultsParallel,
} from "@/shared/core/PipeResult";
import { CreateUserType, RegisterUserType, UserPropType } from "./User.types";
import Entity from "@/shared/domain/Entity";

/**
 * Represents a User domain entity with identity and behavior.
 */
class User extends Entity<UserPropType> {
  public readonly email: Email;
  public password: Password;
  public verified: boolean;

  /**
   * Constructs a new User entity.
   *
   * @param email - The user's email as a value object
   * @param password - The user's password as a value object
   * @param verified - Indicates if the user's email is verified
   * @param id - Unique identifier for the user
   */
  constructor(email: Email, password: Password, verified: boolean, id: string) {
    super(id);
    this.email = email;
    this.password = password;
    this.verified = verified;
  }

  /**
   * Registers a new user and emits a domain event.
   *
   * @param {Object} options - Data required to register the user
   * @param {string} options.id - Unique identifier for the user
   * @param {string} options.emailStr - Raw email string input
   * @param {string} options.rawPassword - Raw password input (unhashed)
   * @param {IHasher} options.hasher - Hasher utility to hash the password
   * @returns A PipeResult containing the created user or an error
   */
  public static register(
    options: RegisterUserType
  ): PipeResult<User, AppError> {
    return this.create({ ...options, verified: false }).onSuccess((user) => {
      user.addDomainEvent(new UserRegisteredEvent(user));
      return user;
    });
  }

  /**
   * Creates a new user entity after validating and constructing value objects.
   *
   * @param options - Input data for user creation
   * @param {string} options.id - Unique identifier for the user
   * @param {string} options.emailStr - Raw email string input
   * @param {string} options.rawPassword - Raw password input (unhashed)
   * @param {IHasher} options.hasher - Hasher utility to hash the password
   * @param {boolean} options.verified - Indicates if the user is verified
   * @returns A PipeResult containing the created user or a validation error
   */
  public static create(
    options: CreateUserType
  ): PipeResult<User, ValidationError> {
    const { id, emailStr, rawPassword, hasher, verified } = options;

    const emailVO = this.createEmailVO(emailStr);
    const passwordVO = this.createPasswordVO(rawPassword, hasher);

    return combinePipeResultsParallel<[Email, Password], ValidationError>([
      Promise.resolve(emailVO),
      passwordVO,
    ]).onSuccess(([email, password]) => {
      return new User(email, password, verified, id);
    });
  }

  /**
   * Helper to construct a password value object.
   *
   * @param rawPassword - The plain text password
   * @param hasher - The injected hasher service
   * @returns A PipeResult of the Password value object
   */
  private static createPasswordVO(rawPassword: string, hasher: IHasher) {
    return Password.create(rawPassword, hasher);
  }

  /**
   * Helper to construct an email value object.
   *
   * @param email - The raw email string
   * @returns A PipeResult of the Email value object
   */
  private static createEmailVO(email: string) {
    return Email.create(email);
  }

  /**
   * Returns the unique identifier of the user.
   *
   * @returns The user's ID
   */
  public getId(): string {
    return this.id;
  }
}

export default User;
