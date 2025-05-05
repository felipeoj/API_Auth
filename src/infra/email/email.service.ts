import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EmailServicePort } from 'src/core/ports/email-service.port';

@Injectable()
export class EmailService implements EmailServicePort {
  constructor(@Inject('EMAIL_CLIENT') private readonly client: ClientProxy) {}

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    await this.client.send('send-email', { email, token }).toPromise();
  }
}
