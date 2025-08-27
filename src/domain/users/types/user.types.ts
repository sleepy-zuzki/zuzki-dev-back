// Tipos puros de dominio: sin dependencias de Nest ni TypeORM

export type UserId = string;

export interface User {
  id: UserId;
  email: string;
  roles: string[];
  isActive: boolean;
  passwordHash: string;
}

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  roles?: string[];
  isActive?: boolean;
}
