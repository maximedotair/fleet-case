import { NextResponse } from "next/server";
import { prisma } from "@/lib/database";

export async function GET() {
  try {
    // Count records in each table using Prisma
    const [userCount, productCount, orderCount, orderItemCount] = await Promise.all([
      prisma.users.count(),
      prisma.products.count(),
      prisma.orders.count(),
      prisma.order_items.count()
    ]);
    
    const status = {
      users: { exists: true, count: userCount },
      products: { exists: true, count: productCount },
      orders: { exists: true, count: orderCount },
      order_items: { exists: true, count: orderItemCount }
    };
    
    return NextResponse.json({
      database_exists: true,
      tables: status,
      total_records: userCount + productCount + orderCount + orderItemCount
    });
    
  } catch (error) {
    console.error("Error checking e-commerce database status:", error);
    return NextResponse.json({
      database_exists: false,
      tables: {
        users: { exists: false, count: 0 },
        products: { exists: false, count: 0 },
        orders: { exists: false, count: 0 },
        order_items: { exists: false, count: 0 }
      },
      total_records: 0,
      error: "Database not accessible"
    });
  }
}