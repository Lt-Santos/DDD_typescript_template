interface EmailService {
  sendVerificationEmail(to: string): Promise<void>;
}

export default EmailService;
