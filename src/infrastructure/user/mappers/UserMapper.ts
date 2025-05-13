import User from "@/domain/user/User";
import IHasher from "@/shared/domain/IHasher";
import { UserDocument } from "@/infrastructure/user/models/user.model";
import { container } from "tsyringe";
import { ValidationError } from "@/shared/core/errors/AppError";
import Result from "@/shared/core/Result";
import TOKENS from "@/infrastructure/ioc/tokens";

/**
 * Maps between persistence layer User documents and domain User aggregates.
 */
class UserMapper {
  /**
   * Maps a MongoDB user document to a domain User instance.
   * @param doc - The user document from the database.
   * @returns A Result wrapping the domain User or a ValidationError.
   */
  static async toDomain(
    doc: UserDocument
  ): Promise<Result<User, ValidationError>> {
    const hasher = container.resolve<IHasher>(TOKENS.IHasher.key);

    const pipe = await User.create({
      id: doc.id,
      emailStr: doc.email,
      rawPassword: doc.password,
      hasher,
      verified: false,
    });
    const result = await pipe.execute();

    if (result.isFail()) return Result.fail(result.getError());
    return Result.ok(result.getValue() as User);
  }

  /**
   * Maps a domain User instance to a plain object for persistence.
   * @param user - The domain User instance.
   * @returns A plain object compatible with MongoDB schema.
   */
  static toPersistence(user: User) {
    return {
      id: user.getId(),
      email: user.email.getValue(),
      password: user.password.getHashedValue(true).getValue(),
      verified: user.verified,
    };
  }
}

export default UserMapper;
