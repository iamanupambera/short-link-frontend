export interface User {
  id: number;
  name: string;
  email: string;
  location?: string | null;
  profilePicture?: string | null;
  isEmailVerified: boolean;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  status: 'ACTIVE' | 'INACTIVE';
}
