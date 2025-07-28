import { NextRequest, NextResponse } from "next/server";
import { salesPredictionAlgorithm } from "../../../../sql/sales-prediction";
import { prisma } from "@/lib/database";
import path from "path";

const dbPath = path.join(process.cwd(), "prisma", "dev.db");

export async function POST(request: NextRequest) {
  try {
    const { period, productIds, advanced } = await request.json();

    // Vérifier que les tables existent via Prisma
    try {
      await prisma.products.count();
      await prisma.orders.count();
      await prisma.order_items.count();
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: "Required tables missing. Please initialize the database first."
      }, { status: 400 });
    }

    const startTime = Date.now();

    // Exécuter l'algorithme de prédiction avec la base unifiée
    const predictions = await salesPredictionAlgorithm({
      dbPath,
      period: period || 30,
      productIds: productIds || [],
      advanced: advanced || false
    });

    const executionTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      predictions,
      executionTime,
      metadata: {
        period,
        productCount: productIds?.length || 0,
        advancedMode: advanced || false
      }
    });

  } catch (error: any) {
    console.error("Prediction error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Error executing prediction algorithm",
      details: error.stack
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Utiliser Prisma pour récupérer les produits et analytics
    const productsRaw = await prisma.$queryRaw`
      SELECT
        p.id,
        p.name,
        p.price,
        COUNT(oi.id) as total_orders,
        SUM(oi.quantity) as total_quantity,
        SUM(oi.quantity * oi.unit_price) as total_revenue
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      GROUP BY p.id, p.name, p.price
      ORDER BY total_revenue DESC
    ` as any[];

    const analyticsRaw = await prisma.$queryRaw`
      SELECT
        COUNT(DISTINCT o.id) as total_orders,
        COUNT(DISTINCT p.id) as total_products,
        COUNT(DISTINCT u.id) as total_customers,
        SUM(oi.quantity * oi.unit_price) as total_revenue,
        AVG(oi.quantity * oi.unit_price) as avg_order_value
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      JOIN users u ON o.user_id = u.id
    ` as any[];

    // Convertir les BigInt en Number pour la sérialisation JSON
    const products = productsRaw.map((product: any) => ({
      ...product,
      total_orders: Number(product.total_orders),
      total_quantity: Number(product.total_quantity || 0),
      total_revenue: Number(product.total_revenue || 0),
      price: Number(product.price)
    }));

    const analytics = analyticsRaw[0] ? {
      total_orders: Number(analyticsRaw[0].total_orders),
      total_products: Number(analyticsRaw[0].total_products),
      total_customers: Number(analyticsRaw[0].total_customers),
      total_revenue: Number(analyticsRaw[0].total_revenue || 0),
      avg_order_value: Number(analyticsRaw[0].avg_order_value || 0)
    } : {};

    return NextResponse.json({
      success: true,
      products,
      analytics
    });

  } catch (error: any) {
    console.error("Get products error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Error loading data"
    }, { status: 500 });
  }
}