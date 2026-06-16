export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface User {
  id: number;
  name: string;
  email: string;
  location?: string | null;
  profilePicture?: string | null;
  isEmailVerified: boolean;
  role: UserRole;
  status: UserStatus;
}
