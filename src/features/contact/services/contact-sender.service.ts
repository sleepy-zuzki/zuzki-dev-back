import { Injectable, Logger } from '@nestjs/common';
import { ContactMessage } from '../dto/contact-message.types';

@Injectable()
export class ContactSenderService {
  private readonly logger = new Logger(ContactSenderService.name);

  private getWebhookUrl(): string {
    const url = process.env.CONTACT_WEBHOOK_URL;
    if (!url) {
      throw new Error('CONTACT_WEBHOOK_URL is not configured');
    }
    return url;
  }

  async send(message: ContactMessage): Promise<void> {
    const url = this.getWebhookUrl();

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        name: message.name,
        email: message.email,
        message: message.message,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      this.logger.error(`Webhook responded with ${res.status}: ${text}`);
      throw new Error(`Webhook call failed with status ${res.status}`);
    }
  }
}
