import User from "@/domain/user/User";
import IHasher from "@/shared/domain/IHasher";
import { UserDocument } from "@/infrastructure/user/models/user.model";
import { container } from "tsyringe";
import { ValidationError } from "@/shared/core/errors/AppError";
import Result from "@/shared/core/Result";

class UserMapper {
  static async toDomain(
    doc: UserDocument
  ): Promise<Result<User, ValidationError>> {
    const hasher = container.resolve<IHasher>("IHasher");

    const pipe = await User.create(
      doc.id,
      doc.email,
      doc.password,
      hasher,
      false
    );
    const result = await pipe.execute();

    if (result.isFail()) return Result.fail(result.getError());
    return Result.ok(result.getValue() as User);
  }

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
