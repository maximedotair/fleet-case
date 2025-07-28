export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}