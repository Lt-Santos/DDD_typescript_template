import { ValidationError } from "@/shared/core/errors/AppError";
import Result from "@/shared/core/Result";
import ValueObject from "@/shared/domain/ValueObject";

interface EmailProps {
  value: string;
}

class Email extends ValueObject<EmailProps> {
  private constructor(props: EmailProps) {
    super(props);
  }

  public static create(email: string): Result<Email, ValidationError> {
    const emailRegexValidator = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const isValid = emailRegexValidator.test(email);

    if (!isValid)
      return Result.fail(new ValidationError("Invalid email address"));

    return Result.ok(new Email({ value: email }));
  }

  public getValue(): string {
    return this.props.value;
  }
}

export default Email;
