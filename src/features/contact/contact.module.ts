import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

import { ContactController } from './controllers/contact.controller';
import { ContactSenderService } from './services/contact-sender.service';
import { ContactService } from './services/contact.service';

@Module({
  imports: [LoggerModule],
  controllers: [ContactController],
  providers: [ContactService, ContactSenderService],
})
export class ContactModule {}
