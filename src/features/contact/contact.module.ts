import { Module } from '@nestjs/common';

import { ContactController } from './controllers/contact.controller';
import { ContactSenderService } from './services/contact-sender.service';
import { ContactService } from './services/contact.service';

@Module({
  imports: [], // Native fetch doesn't need HttpModule
  controllers: [ContactController],
  providers: [ContactService, ContactSenderService],
})
export class ContactModule {}
