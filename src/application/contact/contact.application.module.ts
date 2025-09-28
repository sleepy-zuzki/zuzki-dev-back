import { Module } from '@nestjs/common';

import { ContactCompositionModule } from '@infra/composition/contact.composition.module';

import { SubmitContactService } from './services/submit-contact.service';

@Module({
  imports: [ContactCompositionModule],
  providers: [SubmitContactService],
  exports: [SubmitContactService],
})
export class ContactApplicationModule {}
