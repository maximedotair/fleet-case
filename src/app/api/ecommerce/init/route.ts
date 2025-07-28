import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// Use the same database as Prisma
const dbPath = path.join(process.cwd(), "prisma", "dev.db");

async function getDatabase() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  });
}

export async function POST() {
  try {
    // Read the structure.sql file
    const structureSqlPath = path.join(process.cwd(), "sql", "structure.sql");
    
    if (!fs.existsSync(structureSqlPath)) {
      return NextResponse.json(
        { error: "structure.sql file not found" },
        { status: 404 }
      );
    }
    
    const structureSql = fs.readFileSync(structureSqlPath, "utf8");
    
    const db = await getDatabase();
    
    // Drop existing tables to ensure clean state
    try {
      await db.run("DROP TABLE IF EXISTS order_items");
      await db.run("DROP TABLE IF EXISTS orders");
      await db.run("DROP TABLE IF EXISTS products");
      await db.run("DROP TABLE IF EXISTS users");
    } catch (error) {
      console.log("Tables may not exist yet, continuing...");
    }
    
    // Better SQL parsing for multi-line statements
    // Remove comments and normalize whitespace
    const cleanSql = structureSql
      .replace(/--.*$/gm, '') // Remove comments
      .replace(/\s+/g, ' ')    // Normalize whitespace
      .trim();
    
    // Split SQL into individual statements and filter
    const statements = cleanSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`Found ${statements.length} statements`);
    console.log('First few statements:', statements.slice(0, 3).map(s => s.substring(0, 50)));
    
    let tablesCreated = 0;
    let recordsInserted = 0;
    
    // First pass: Create tables only
    for (const statement of statements) {
      try {
        if (statement.toLowerCase().includes('create table')) {
          console.log(`Creating table: ${statement.substring(0, 100)}...`);
          await db.run(statement);
          tablesCreated++;
          console.log(`Table created successfully!`);
        }
      } catch (error) {
        console.error(`Error creating table: ${statement.substring(0, 100)}...`, error);
      }
    }
    
    console.log(`Tables created: ${tablesCreated}`);
    
    // Second pass: Insert data
    for (const statement of statements) {
      try {
        if (statement.toLowerCase().includes('insert into')) {
          const result = await db.run(statement);
          recordsInserted += result.changes || 0;
        }
      } catch (error) {
        console.error(`Error inserting data: ${statement.substring(0, 100)}...`, error);
      }
    }
    
    // Third pass: Create indexes and views
    for (const statement of statements) {
      try {
        if (statement.toLowerCase().includes('create index') ||
           statement.toLowerCase().includes('create view')) {
          await db.run(statement);
        }
      } catch (error) {
        console.error(`Error creating index/view: ${statement.substring(0, 100)}...`, error);
      }
    }
    
    await db.close();
    
    // Synchronize Prisma schema with the database
    console.log("Synchronizing Prisma schema...");
    let prismaSteps = 0;
    
    try {
      console.log("Running prisma db pull...");
      await execAsync("pnpm prisma db pull");
      prismaSteps++;
      
      console.log("Running prisma generate...");
      await execAsync("pnpm prisma generate");
      prismaSteps++;
      
      console.log("Prisma synchronization completed successfully!");
    } catch (error) {
      console.error("Prisma sync error:", error);
    }
    
    return NextResponse.json({
      success: true,
      message: "E-commerce database initialized successfully from SQL files",
      tablesCreated,
      recordsInserted,
      prismaSteps,
      details: "Database created, Prisma schema synchronized and client generated"
    });
    
  } catch (error) {
    console.error("Error initializing e-commerce database:", error);
    return NextResponse.json(
      { error: "Failed to initialize database" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const db = await getDatabase();
    
    // Drop all e-commerce tables
    await db.run("DROP TABLE IF EXISTS order_items");
    await db.run("DROP TABLE IF EXISTS orders");
    await db.run("DROP TABLE IF EXISTS products");
    await db.run("DROP TABLE IF EXISTS users");
    
    await db.close();
    
    return NextResponse.json({
      success: true,
      message: "E-commerce tables deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting e-commerce database:", error);
    return NextResponse.json(
      { error: "Failed to delete database" },
      { status: 500 }
    );
  }
}