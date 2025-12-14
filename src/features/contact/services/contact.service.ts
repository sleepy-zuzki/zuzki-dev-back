import { Injectable } from '@nestjs/common';

import { ContactMessage } from '../dto/contact-message.types';

import { ContactSenderService } from './contact-sender.service';

@Injectable()
export class ContactService {
  constructor(private readonly sender: ContactSenderService) {}

  async execute(input: ContactMessage): Promise<void> {
    await this.sender.send(input);
  }
}
