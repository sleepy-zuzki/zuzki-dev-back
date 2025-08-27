import { Stack } from '@domain/catalog/types/stack.types';

export interface StackView {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
}

export const toStackView = (s: Stack): StackView => ({
  id: s.id,
  name: s.name,
  slug: s.slug,
  description: s.description ?? null,
});
