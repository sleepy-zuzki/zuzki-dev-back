import { Inject, Injectable } from '@nestjs/common';

import { ContactMessage } from '@domain/contact/types/contact-message.types';

import {
  CONTACT_SENDER_PORT,
  type ContactSenderPort,
} from '../ports/contact-sender.port';

@Injectable()
export class SubmitContactService {
  constructor(
    @Inject(CONTACT_SENDER_PORT)
    private readonly sender: ContactSenderPort,
  ) {}

  async execute(input: ContactMessage): Promise<void> {
    await this.sender.send(input);
  }
}
