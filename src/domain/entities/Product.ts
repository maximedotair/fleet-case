export interface Product {
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