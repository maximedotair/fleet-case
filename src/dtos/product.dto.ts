export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  category?: string;
  sku?: string;
  isActive?: boolean;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  stockQuantity?: number;
  category?: string;
  sku?: string;
  isActive?: boolean;
}

export interface ProductResponseDto {
  id: number;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  category?: string;
  sku?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}