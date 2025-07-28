import { Order } from "./Order";
import { Product } from "./Product";

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: Date;
  
  // Relations
  order?: Order;
  product?: Product;
}