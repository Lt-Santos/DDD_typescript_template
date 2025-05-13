/**
 * Interface for sending emails from the application.
 */
interface EmailService {
  /**
   * Sends a verification email to a user.
   * @param to - The recipient's email address.
   */
  sendVerificationEmail(to: string): Promise<void>;
}

export default EmailService;
