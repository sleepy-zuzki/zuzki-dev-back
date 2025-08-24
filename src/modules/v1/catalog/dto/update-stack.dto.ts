import type { StackArea } from '../../../../core/models/catalog/stack.types';

export class UpdateStackDto {
  name?: string;
  slug?: string;
  area?: StackArea;
  description?: string | null;
}
