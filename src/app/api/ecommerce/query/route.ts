import { NextRequest, NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import fs from "fs";

// Use the same database as Prisma
const dbPath = path.join(process.cwd(), "prisma", "dev.db");

async function getDatabase() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  });
}

export async function GET() {
  try {
    // Read the query.sql file and return its content
    const querySqlPath = path.join(process.cwd(), "sql", "query.sql");
    
    if (!fs.existsSync(querySqlPath)) {
      return NextResponse.json(
        { error: "query.sql file not found" },
        { status: 404 }
      );
    }
    
    const querySql = fs.readFileSync(querySqlPath, "utf8");
    
    // Parse queries and extract the main ones
    const queries = [
      {
        id: "users_product_1_last_7_days",
        name: "Users who bought PRODUCT_1 in the past 7 days",
        sql: `SELECT DISTINCT u.email
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE p.name = 'PRODUCT_1'
  AND o.order_date >= datetime('now', '-7 days')
  AND o.order_date <= datetime('now')
ORDER BY u.email;`
      },
      {
        id: "daily_sales_totals",
        name: "Total sales amount, per day",
        sql: `SELECT 
    DATE(o.order_date) as sales_date,
    SUM(o.total_amount) as total_sales_amount,
    COUNT(o.id) as number_of_orders,
    COUNT(DISTINCT o.user_id) as unique_customers
FROM orders o
WHERE o.status IN ('delivered', 'shipped', 'pending')
GROUP BY DATE(o.order_date)
ORDER BY sales_date DESC;`
      },
      {
        id: "product_performance",
        name: "Product performance analysis",
        sql: `SELECT 
    p.name as product_name,
    p.category,
    SUM(oi.quantity) as total_quantity_sold,
    SUM(oi.total_price) as total_revenue,
    COUNT(DISTINCT oi.order_id) as number_of_orders,
    AVG(oi.unit_price) as average_unit_price
FROM products p
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
WHERE o.status IN ('delivered', 'shipped', 'pending')
GROUP BY p.id, p.name, p.category
ORDER BY total_revenue DESC;`
      },
      {
        id: "weekly_sales_trend",
        name: "Weekly sales trend",
        sql: `SELECT 
    strftime('%Y-%W', o.order_date) as week_year,
    strftime('%Y-%m-%d', DATE(o.order_date, 'weekday 0', '-6 days')) as week_start,
    strftime('%Y-%m-%d', DATE(o.order_date, 'weekday 0')) as week_end,
    SUM(o.total_amount) as weekly_sales,
    COUNT(o.id) as weekly_orders,
    COUNT(DISTINCT o.user_id) as unique_customers
FROM orders o
WHERE o.status IN ('delivered', 'shipped', 'pending')
GROUP BY strftime('%Y-%W', o.order_date)
ORDER BY week_year DESC;`
      }
    ];
    
    return NextResponse.json({
      queries,
      full_content: querySql
    });
    
  } catch (error) {
    console.error("Error reading query file:", error);
    return NextResponse.json(
      { error: "Failed to read query file" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sql } = await request.json();
    
    if (!sql || typeof sql !== 'string') {
      return NextResponse.json(
        { error: "SQL query is required" },
        { status: 400 }
      );
    }
    
    // Check if database exists
    if (!fs.existsSync(dbPath)) {
      return NextResponse.json(
        { error: "Database not found. Please initialize it first." },
        { status: 404 }
      );
    }
    
    const db = await getDatabase();
    
    // Execute the query
    const startTime = Date.now();
    
    try {
      const results = await db.all(sql);
      const executionTime = Date.now() - startTime;
      
      await db.close();
      
      return NextResponse.json({
        success: true,
        results,
        executionTime,
        rowCount: results.length
      });
      
    } catch (sqlError: any) {
      await db.close();
      return NextResponse.json(
        { 
          error: "SQL execution error", 
          details: sqlError.message,
          sql: sql.substring(0, 200) + "..."
        },
        { status: 400 }
      );
    }
    
  } catch (error) {
    console.error("Error executing SQL query:", error);
    return NextResponse.json(
      { error: "Failed to execute query" },
      { status: 500 }
    );
  }
}