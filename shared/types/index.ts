export type UserRole = 'ADMIN' | 'OWNER' | 'USER';

export interface SharedUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  location?: string;
}

export interface SharedBook {
  id: number;
  bookName: string;
  author?: string;
  category?: string;
  ownerId: number;
  isApproved: boolean;
  price?: number;
}