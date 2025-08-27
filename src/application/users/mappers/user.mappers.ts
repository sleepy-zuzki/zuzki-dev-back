import { User } from '../../../domain/users/types/user.types';

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
