import ValueObject from "@/shared/domain/ValueObject";
import IHasher from "../../../shared/domain/IHasher";
import { ValidationError } from "@/shared/core/errors/AppError";
import Result from "@/shared/core/Result";

interface PasswordProps {
  hashedValue: string;
  isHashed?: boolean;
}

/**
 * Value object representing a password with validation, hashing, and comparison logic.
 * This class ensures password security by controlling access and enforcing strength rules.
 */
class Password extends ValueObject<PasswordProps> {
  /**
   * Constructs a Password instance.
   * Use the static `create` method for proper validation and hashing.
   *
   * @param props - Internal password properties
   */
  private constructor(props: PasswordProps) {
    super(props);
  }

  /**
   * Factory method to create a new Password value object.
   * Performs validation and hashing unless the value is already hashed.
   *
   * @param rawValue - Plaintext password or hashed password
   * @param hasher - The IHasher implementation used to hash and compare
   * @param isHashed - Flag indicating whether the input is already hashed
   * @returns A Result containing either a valid Password instance or a ValidationError
   */
  public static async create(
    rawValue: string,
    hasher: IHasher,
    isHashed?: boolean
  ): Promise<Result<Password, ValidationError>> {
    if (!isHashed && !Password.isValid(rawValue))
      return Result.fail(new ValidationError("Invalid password"));

    const value = isHashed ? rawValue : await hasher.hash(rawValue);
    return Result.ok(new Password({ hashedValue: value, isHashed: true }));
  }

  /**
   * Compares a plain password with the stored hashed password using the provided hasher.
   *
   * @param plain - The plain password to compare
   * @param hasher - The IHasher instance used to compare passwords
   * @returns A boolean indicating if the plain password matches the hashed one
   */
  public async compare(plain: string, hasher: IHasher): Promise<boolean> {
    return await hasher.compare(plain, this.props.hashedValue);
  }

  /**
   * Returns the hashed password value only if marked for persistence.
   *
   * @param forPersistence - Flag indicating if access is for persistence layer
   * @returns A Result containing the hashed password or a ValidationError
   */
  getHashedValue(forPersistence = false): Result<string, ValidationError> {
    if (!forPersistence) {
      return Result.fail(
        new ValidationError("Access to password is restricted")
      );
    }
    return Result.ok(this.props.hashedValue);
  }

  /**
   * Compares this password object to another for equality.
   *
   * @param other - The other Password instance to compare
   * @returns True if both represent the same hashed password
   */
  public equals(other: Password): boolean {
    const otherHashedResult = other.getHashedValue();
    return (
      otherHashedResult.isOk() &&
      this.props.hashedValue === otherHashedResult.getValue()
    );
  }

  /**
   * Validates a raw password against predefined strength rules.
   *
   * @param password - The plaintext password to validate
   * @returns True if the password meets all complexity requirements
   */
  private static isValid(password: string): boolean {
    const minLength = 8;
    const maxLength = 64;
    const uppercase = /[A-Z]/;
    const lowercase = /[a-z]/;
    const digit = /\d/;
    const special = /[!@#$%^&*(),.?":{}|<>]/;

    return (
      password.length >= minLength &&
      password.length <= maxLength &&
      uppercase.test(password) &&
      lowercase.test(password) &&
      digit.test(password) &&
      special.test(password)
    );
  }
}

export default Password;
