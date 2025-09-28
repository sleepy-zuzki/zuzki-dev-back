import type { ContactMessage } from '@domain/contact/types/contact-message.types';

export interface ContactSenderPort {
  send(message: ContactMessage): Promise<void>;
}

export const CONTACT_SENDER_PORT = Symbol('CONTACT_SENDER_PORT');
