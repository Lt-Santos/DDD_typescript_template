import Email from "./valueObjects/Email";
import Password from "./valueObjects/Password";
import IHasher from "../../shared/domain/IHasher";
import UserRegisteredEvent from "./events/UserRegisteredEvent";
import AggregateRoot from "../../shared/domain/AggregateRoot";
import { ValidationError } from "@/shared/core/errors/AppError";
import { combinePipeResults } from "@/shared/core/PipeResult";

class User extends AggregateRoot {
  constructor(
    public readonly id: string,
    public readonly email: Email,
    public password: Password,
    public verified: boolean
  ) {
    super();
  }

  public static async register(
    id: string,
    emailStr: string,
    rawPassword: string,
    hasher: IHasher
  ) {
    return (await this.create(id, emailStr, rawPassword, hasher, false)).map(
      (user) => {
        user.addDomainEvent(new UserRegisteredEvent(user));
        return user;
      }
    );
  }

  public static async create(
    id: string,
    emailStr: string,
    rawPassword: string,
    hasher: IHasher,
    verified: boolean
  ) {
    const emailVO = this.createEmailVO(emailStr);
    const passwordVO = this.createPasswordVO(rawPassword, hasher);

    return combinePipeResults<[Email, Password], ValidationError>([
      Promise.resolve(emailVO),
      passwordVO,
    ]).map(([emailVO, passwordVO]) => {
      return new User(id, emailVO, passwordVO, verified);
    });
  }

  private static createPasswordVO(rawPassword: string, hasher: IHasher) {
    return Password.create(rawPassword, hasher);
  }

  private static createEmailVO(email: string) {
    return Email.create(email);
  }

  getId(): string {
    return this.id;
  }
}

export default User;
