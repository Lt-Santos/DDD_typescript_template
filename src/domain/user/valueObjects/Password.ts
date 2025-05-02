import ValueObject from "@/shared/domain/ValueObject";
import IHasher from "../../../shared/domain/IHasher";
import { ValidationError } from "@/shared/core/errors/AppError";
import Result from "@/shared/core/Result";

interface PasswordProps {
  hashedValue: string;
  isHashed?: boolean;
}

class Password extends ValueObject<PasswordProps> {
  private constructor(props: PasswordProps) {
    super(props);
  }

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

  public async compare(plain: string, hasher: IHasher): Promise<boolean> {
    return await hasher.compare(plain, this.props.hashedValue);
  }

  getHashedValue(forPersistence = false): Result<string, ValidationError> {
    if (!forPersistence) {
      return Result.fail(
        new ValidationError("Access to password is restricted")
      );
    }
    return Result.ok(this.props.hashedValue);
  }

  public equals(other: Password): boolean {
    const otherHashedResult = other.getHashedValue();
    return (
      otherHashedResult.isOk() &&
      this.props.hashedValue === otherHashedResult.getValue()
    );
  }

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
