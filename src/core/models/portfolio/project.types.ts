// Tipados para proyectos
export const PROJECT_CATEGORIES = [
  'front',
  'back',
  'mobile',
  'devops',
  'design',
] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];
