import { User } from "./User";

export interface Order {
  id: number;
  userId: number;
  orderNumber: string;
  status: string;
  totalAmount: number;
  shippingAddress?: string;
  orderDate: Date;
  shippedDate?: Date;
  deliveredDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  user?: User;
  orderItems?: any[]; // Évite la référence circulaire
}