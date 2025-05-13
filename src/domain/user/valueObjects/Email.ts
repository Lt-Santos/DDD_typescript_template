import { ValidationError } from "@/shared/core/errors/AppError";
import Result from "@/shared/core/Result";
import ValueObject from "@/shared/domain/ValueObject";

interface EmailProps {
  value: string;
}

/**
 * Represents a validated Email value object.
 * Encapsulates email validation logic and ensures immutability.
 */
class Email extends ValueObject<EmailProps> {
  /**
   * Constructs a new Email value object.
   * Use the static `create` method for instantiation with validation.
   *
   * @param props - The email value to wrap
   */
  private constructor(props: EmailProps) {
    super(props);
  }

  /**
   * Factory method to create a validated Email value object.
   *
   * @param email - The raw email string to validate and wrap
   * @returns A Result containing either a valid Email instance or a ValidationError
   */
  public static create(email: string): Result<Email, ValidationError> {
    const emailRegexValidator = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const isValid = emailRegexValidator.test(email);

    if (!isValid)
      return Result.fail(new ValidationError("Invalid email address"));

    return Result.ok(new Email({ value: email }));
  }

  /**
   * Retrieves the string value of the email.
   *
   * @returns The validated email address as a string
   */
  public getValue(): string {
    return this.props.value;
  }
}

export default Email;
