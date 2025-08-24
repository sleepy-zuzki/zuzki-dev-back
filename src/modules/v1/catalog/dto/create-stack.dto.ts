import type { StackArea } from '../../../../core/models/catalog/stack.types';

export class CreateStackDto {
  name!: string;
  slug!: string;
  area!: StackArea;
  description?: string | null;
}
