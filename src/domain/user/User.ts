import Email from "./valueObjects/Email";
import Password from "./valueObjects/Password";
import IHasher from "../../shared/domain/IHasher";
import UserRegisteredEvent from "./events/UserRegisteredEvent";
import AggregateRoot from "../../shared/domain/AggregateRoot";
import { ValidationError } from "@/shared/core/errors/AppError";
import { combinePipeResults } from "@/shared/core/PipeResult";
import { CreateUserType, RegisterUserType } from "./User.types";

class User extends AggregateRoot {
  constructor(
    public readonly id: string,
    public readonly email: Email,
    public password: Password,
    public verified: boolean
  ) {
    super();
  }

  public static async register(userOptions: RegisterUserType) {
    return (await this.create({ ...userOptions, verified: false })).onSuccess(
      (user) => {
        user.addDomainEvent(new UserRegisteredEvent(user));
        return user;
      }
    );
  }

  public static async create(createOptions: CreateUserType) {
    const { id, emailStr, rawPassword, hasher, verified } = createOptions;
    const emailVO = this.createEmailVO(emailStr);
    const passwordVO = this.createPasswordVO(rawPassword, hasher);

    return combinePipeResults<[Email, Password], ValidationError>([
      Promise.resolve(emailVO),
      passwordVO,
    ]).onSuccess(([emailVO, passwordVO]) => {
      return new User(id, emailVO, passwordVO, verified);
    });
  }

  private static createPasswordVO(rawPassword: string, hasher: IHasher) {
    return Password.create(rawPassword, hasher);
  }

  private static createEmailVO(email: string) {
    return Email.create(email);
  }

  public getId(): string {
    return this.id;
  }
}

export default User;
