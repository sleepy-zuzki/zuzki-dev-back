import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

import { N8nModule } from '@shared/n8n/n8n.module';

import { ContactController } from './controllers/contact.controller';
import { ContactSenderService } from './services/contact-sender.service';
import { ContactService } from './services/contact.service';

@Module({
  imports: [LoggerModule, N8nModule],
  controllers: [ContactController],
  providers: [ContactService, ContactSenderService],
})
export class ContactModule {}
