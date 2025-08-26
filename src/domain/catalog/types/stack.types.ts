// Tipados para tech stacks
export const STACK_AREAS = [
  'front',
  'back',
  'mobile',
  'devops',
  'design',
] as const;
export type StackArea = (typeof STACK_AREAS)[number];
