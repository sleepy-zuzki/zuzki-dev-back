import { Module } from '@nestjs/common';

import { CONTACT_SENDER_PORT } from '@application/contact/ports/contact-sender.port';

import { HttpContactSenderAdapter } from '../http-clients/contact/http-contact-sender.adapter';

@Module({
  providers: [
    HttpContactSenderAdapter,
    {
      provide: CONTACT_SENDER_PORT,
      useClass: HttpContactSenderAdapter,
    },
  ],
  exports: [CONTACT_SENDER_PORT],
})
export class ContactCompositionModule {}
