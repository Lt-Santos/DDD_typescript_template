import EmailService from "./EmailService";

class ConsoleEmailService implements EmailService {
  async sendVerificationEmail(to: string): Promise<void> {
    console.log(
      `Sending Verification Email to ${to}. Here is the verification link`
    );
  }
}

export default ConsoleEmailService;
