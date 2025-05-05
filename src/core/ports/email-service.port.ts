export interface EmailServicePort {
  sendVerificationEmail(email: string, token: string): Promise<void>;
}
