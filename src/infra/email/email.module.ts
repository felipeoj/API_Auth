import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailClientProvider } from './email.client';

@Module({
  providers: [EmailService, EmailClientProvider],
  exports: [EmailService],
})
export class EmailModule {}
