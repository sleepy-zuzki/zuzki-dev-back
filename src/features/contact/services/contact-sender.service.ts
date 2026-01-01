import { Injectable, Logger } from '@nestjs/common';

import { N8nService } from '@shared/n8n/n8n.service';

import { ContactMessage } from '../dto/contact-message.types';

@Injectable()
export class ContactSenderService {
  private readonly logger = new Logger(ContactSenderService.name);

  constructor(private readonly n8nService: N8nService) {}

  async send(message: ContactMessage): Promise<void> {
    await this.n8nService.sendWebhook('CONTACT_WEBHOOK_URL', {
      name: message.name,
      email: message.email,
      message: message.message,
    });
  }
}
