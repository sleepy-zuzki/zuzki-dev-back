export type CreateUserInput = {
  email: string;
  passwordHash: string;
  roles?: string[];
  isActive?: boolean;
};
