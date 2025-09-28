import { Module } from '@nestjs/common';

import { ContactApplicationModule } from '@application/contact/contact.application.module';

import { ContactController } from './controllers/contact.controller';

@Module({
  imports: [ContactApplicationModule],
  controllers: [ContactController],
})
export class ContactModule {}
