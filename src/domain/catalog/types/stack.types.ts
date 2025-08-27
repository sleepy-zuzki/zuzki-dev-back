// Tipados para tech stacks
export const STACK_AREAS = [
  'front',
  'back',
  'mobile',
  'devops',
  'design',
] as const;
export type StackArea = (typeof STACK_AREAS)[number];
export interface Stack {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
}

export interface CreateStackInput {
  name: string;
  slug: string;
  description?: string | null;
}

export interface UpdateStackInput {
  name?: string;
  slug?: string;
  description?: string | null;
}
