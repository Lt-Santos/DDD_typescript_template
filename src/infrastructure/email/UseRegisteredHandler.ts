import UserRegisteredEvent from "@/domain/user/events/UserRegisteredEvent";
import EmailService from "./EmailService";

/**
 * Factory function for handling the UserRegisteredEvent.
 * Sends a verification email to the user upon registration.
 *
 * @param emailService - The email service used to send the email.
 * @returns An event handler function.
 */
const handleUserRegistered = (emailService: EmailService) => {
  return async (event: UserRegisteredEvent): Promise<void> => {
    const userEmail = event.user.email.getValue();
    await emailService.sendVerificationEmail(userEmail);
  };
};

export default handleUserRegistered;
