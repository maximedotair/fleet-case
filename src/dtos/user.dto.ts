export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
}

export interface UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
}

export interface UserResponseDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}