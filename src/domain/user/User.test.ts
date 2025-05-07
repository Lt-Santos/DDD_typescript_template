import { container } from "tsyringe";
import User from "./User";
import { ValidationError } from "@/shared/core/errors/AppError";
import IHasher from "@/shared/domain/IHasher";
import TOKENS from "@/infrastructure/ioc/tokens";

describe("User Entity", () => {
  const validEmail = "test@email.com";
  const validPassword = "StrongP@ssword123";
  const id = "abc-123";
  const hasher = container.resolve<IHasher>(TOKENS.IHasher.key);
  it("should register a valid user", async () => {
    const result = await (
      await User.register({
        id,
        emailStr: validEmail,
        rawPassword: validPassword,
        hasher,
      })
    ).execute();
    expect(result.isOk()).toBe(true);

    const user = result.getValue();
    expect(user.getId()).toBe(id);
    expect(user.email.getValue()).toBe(validEmail);
    expect(await user.password.compare(validPassword, hasher)).toBe(true);
  });
  it("should fail to register a user with an invalid email", async () => {
    const result = await (
      await User.register({
        id,
        emailStr: "invalid@email",
        rawPassword: validPassword,
        hasher,
      })
    ).execute();
    expect(result.isFail()).toBe(true);
    expect(result.getError()).toBeInstanceOf(ValidationError);
  });
  it("should fail to register a user with a weak password", async () => {
    const result = await (
      await User.register({
        id,
        emailStr: validEmail,
        rawPassword: "invalid-password",
        hasher,
      })
    ).execute();
    expect(result.isFail()).toBe(true);
    expect(result.getError()).toBeInstanceOf(ValidationError);
  });
  it("should attach a registered user domain event upon successful registration", async () => {
    const result = await (
      await User.register({
        id,
        emailStr: validEmail,
        rawPassword: validPassword,
        hasher,
      })
    ).execute();
    expect(result.isOk()).toBe(true);

    const user = result.getValue();
    const events = user.pullDomainEvents();
    expect(events.length).toBe(1);
    expect(events[0].constructor.name).toBe("UserRegisteredEvent");
  });
});
