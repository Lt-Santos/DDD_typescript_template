import ValueObject from "@/shared/domain/ValueObject";
import IHasher from "../../../shared/domain/IHasher";
import { ValidationError } from "@/shared/core/errors/AppError";
import Result from "@/shared/core/Result";

interface PasswordProps {
  hashedValue: string;
}

class Password extends ValueObject<PasswordProps> {
  private constructor(props: PasswordProps) {
    super(props);
  }

  public static async create(
    rawValue: string,
    isHashed: boolean,
    hasher: IHasher
  ): Promise<Result<Password, ValidationError>> {
    if (!rawValue) return Result.fail(new ValidationError("Invalid password"));
    const value = isHashed ? rawValue : await hasher.hash(rawValue);
    return Result.ok(new Password({ hashedValue: value }));
  }

  public async compare(plain: string, hasher: IHasher): Promise<boolean> {
    return hasher.compare(plain, this.props.hashedValue);
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
}

export default Password;
