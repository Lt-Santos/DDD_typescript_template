import EmailService from "./EmailService";

class ConsoleEmailService implements EmailService {
  async sendVerificationEmail(to: string): Promise<void> {
    console.log(`Sending Verification Email to ${to}`);
  }
}

export default ConsoleEmailService;
