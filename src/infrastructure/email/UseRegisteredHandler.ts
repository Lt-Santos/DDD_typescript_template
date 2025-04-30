import UserRegisteredEvent from "@/domain/user/events/UserRegisteredEvent";
import EmailService from "./EmailService";

const handleUserRegistered = (emailService: EmailService) => {
  return async (event: UserRegisteredEvent): Promise<void> => {
    const userEmail = event.user.email.getValue();
    await emailService.sendVerificationEmail(userEmail);
  };
};

export default handleUserRegistered;
