import type { User } from '../dto/user.types';

export interface UserView {
  id: string;
  email: string;
  roles: string[];
  isActive: boolean;
}

export const toUserView = (u: User): UserView => ({
  id: u.id,
  email: u.email,
  roles: u.roles,
  isActive: u.isActive,
});
