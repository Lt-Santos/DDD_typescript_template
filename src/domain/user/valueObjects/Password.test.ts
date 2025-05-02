import Password from "@/domain/user/valueObjects/Password";
import TOKENS from "@/infrastructure/ioc/tokens";
import Result from "@/shared/core/Result";
import { ValidationError } from "@/shared/core/errors/AppError";
import IHasher from "@/shared/domain/IHasher";
import { container } from "tsyringe";

describe("Password VO", () => {
  it("should create a valid password when it meets all complexity rules", async () => {
    const rawPassword = "StrongP@ssword123";
    const hasher = container.resolve<IHasher>(TOKENS.IHasher.key);
    const result = await Password.create(rawPassword, hasher);
    expect(result.isOk()).toBe(true);

    const password = result.getValue();
    expect(password).toBeDefined();
    expect(await password.compare(rawPassword, hasher)).toBe(true);
  });

  it("should compare equal hashed passwords correctly", async () => {
    const rawPassword = "StrongP@ssword123";
    const hasher = container.resolve<IHasher>(TOKENS.IHasher.key);
    const result1 = await Password.create(rawPassword, hasher);
    const result2 = await Password.create(rawPassword, hasher);
    expect(result1.isOk()).toBe(true);
    expect(result2.isOk()).toBe(true);

    const password1 = result1.getValue();
    const password2 = result2.getValue();
    expect(password1.equals(password2));
  });

  it("should compare equal hashed passwords and a raw password correctly", async () => {
    const rawPassword = "StrongP@ssword123";
    const hasher = container.resolve<IHasher>(TOKENS.IHasher.key);
    const result = await Password.create(rawPassword, hasher);
    expect(result.isOk()).toBe(true);

    const password = result.getValue();
    expect(await password.compare(rawPassword, hasher));
  });

  it("should fail if password is too short", async () => {
    const rawPassword = "SP@1";
    const hasher = container.resolve<IHasher>(TOKENS.IHasher.key);
    const result = await Password.create(rawPassword, hasher);
    expect(result.isFail()).toBe(true);
    expect(result.getError()).toBeInstanceOf(ValidationError);
  });

  it("should fail if password is missing uppercase", async () => {
    const rawPassword = "strongp@ssword123";
    const hasher = container.resolve<IHasher>(TOKENS.IHasher.key);
    const result = await Password.create(rawPassword, hasher);
    expect(result.isFail()).toBe(true);
    expect(result.getError()).toBeInstanceOf(ValidationError);
  });

  it("should fail if password is missing lowercase", async () => {
    const rawPassword = "STRONGP@SSWORD123";
    const hasher = container.resolve<IHasher>(TOKENS.IHasher.key);
    const result = await Password.create(rawPassword, hasher);
    expect(result.isFail()).toBe(true);
    expect(result.getError()).toBeInstanceOf(ValidationError);
  });

  it("should fail if password is missing digit", async () => {
    const rawPassword = "StrongP@ssword";
    const hasher = container.resolve<IHasher>(TOKENS.IHasher.key);
    const result = await Password.create(rawPassword, hasher);
    expect(result.isFail()).toBe(true);
    expect(result.getError()).toBeInstanceOf(ValidationError);
  });

  it("should fail if password is missing special character", async () => {
    const rawPassword = "StrongPassword123";
    const hasher = container.resolve<IHasher>(TOKENS.IHasher.key);
    const result = await Password.create(rawPassword, hasher);
    expect(result.isFail()).toBe(true);
    expect(result.getError()).toBeInstanceOf(ValidationError);
  });

  it("should fail if password is too long", async () => {
    const rawPassword =
      "StrongP@ssword123adwewqdadkaldjwlkejwqlejqlkdjsakdlasjflfjaslkjlwkjewqjlaskjflksjflkasjflkajewlkqejljalsjeadajwljelqjel";
    const hasher = container.resolve<IHasher>(TOKENS.IHasher.key);
    const result = await Password.create(rawPassword, hasher);
    expect(result.isFail()).toBe(true);
    expect(result.getError()).toBeInstanceOf(ValidationError);
  });

  it("should accept already hashed password without validation", async () => {
    const hashedPassword = "hashedpassword";
    const hasher = container.resolve<IHasher>(TOKENS.IHasher.key);
    const result = await Password.create(hashedPassword, hasher, true);
    expect(result.isOk()).toBe(true);

    const password = result.getValue();
    expect(await password.compare(hashedPassword, hasher)).toBe(false);
    expect(password.getHashedValue(true).getValue()).toBe(hashedPassword);
  });
});
