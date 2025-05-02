import Email from "./Email";
import { ValidationError } from "@/shared/core/errors/AppError";

describe("Email Value Object", () => {
  it("should create a valid email", () => {
    const result = Email.create("test@example.com");
    expect(result.isOk()).toBe(true);

    const email = result.getValue();
    expect(email.getValue()).toBe("test@example.com");
  });
  it("should fail when email is invalid", () => {
    const result = Email.create("test.example.com");
    expect(result.isFail()).toBe(true);

    const error = result.getError();
    expect(error).toBeInstanceOf(ValidationError);
  });
  it("should treat 2 emails with the same value as equal", () => {
    const email1 = Email.create("test@example.com");
    const email2 = Email.create("test@example.com");
    expect(email1.isOk());
    expect(email2.isOk());

    const equal = email1.getValue().equals(email2.getValue());
    expect(equal).toBe(true);
  });
  it("should treat 2 emails with different values as not equal", () => {
    const email1 = Email.create("test@example.com");
    const email2 = Email.create("test1@example.com");
    expect(email1.isOk());
    expect(email2.isOk());

    const equal = email1.getValue().equals(email2.getValue());
    expect(equal).toBe(false);
  });
});
