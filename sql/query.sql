-- SQL Queries for Unified Database Analysis (E-commerce + Fleet Management)
-- Fleet Management Technical Test

-- ========================================
-- Query 1: E-mail addresses of users who have bought PRODUCT_1 in the past 7 days
-- ========================================

SELECT DISTINCT u.email
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE p.name = 'PRODUCT_1'
  AND o.order_date >= datetime('now', '-7 days')
  AND o.order_date <= datetime('now')
ORDER BY u.email;

-- Alternative query using product ID (if PRODUCT_1 has ID = 1)
-- This approach is more efficient if you know the product ID
SELECT DISTINCT u.email
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN order_items oi ON o.id = oi.order_id
WHERE oi.product_id = 1  -- Assuming PRODUCT_1 has ID = 1
  AND o.order_date >= datetime('now', '-7 days')
  AND o.order_date <= datetime('now')
ORDER BY u.email;

-- ========================================
-- Query 2: Total sales amount, per day
-- ========================================

SELECT 
    DATE(o.order_date) as sales_date,
    SUM(o.total_amount) as total_sales_amount,
    COUNT(o.id) as number_of_orders,
    COUNT(DISTINCT o.user_id) as unique_customers
FROM orders o
WHERE o.status IN ('delivered', 'shipped', 'pending')  -- Exclude cancelled orders
GROUP BY DATE(o.order_date)
ORDER BY sales_date DESC;

-- Alternative version with more detailed breakdown
SELECT 
    DATE(o.order_date) as sales_date,
    SUM(o.total_amount) as total_sales_amount,
    COUNT(o.id) as total_orders,
    COUNT(DISTINCT o.user_id) as unique_customers,
    AVG(o.total_amount) as average_order_value,
    MIN(o.total_amount) as min_order_value,
    MAX(o.total_amount) as max_order_value
FROM orders o
WHERE o.status IN ('delivered', 'shipped', 'pending')
GROUP BY DATE(o.order_date)
ORDER BY sales_date DESC;

-- ========================================
-- Additional Useful Queries for Analysis
-- ========================================

-- Query 3: Sales summary for the last 30 days
SELECT 
    DATE(o.order_date) as sales_date,
    SUM(o.total_amount) as daily_sales,
    COUNT(o.id) as orders_count,
    SUM(SUM(o.total_amount)) OVER (ORDER BY DATE(o.order_date)) as cumulative_sales
FROM orders o
WHERE o.order_date >= datetime('now', '-30 days')
  AND o.status IN ('delivered', 'shipped', 'pending')
GROUP BY DATE(o.order_date)
ORDER BY sales_date;

-- Query 4: Product performance analysis
SELECT 
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
ORDER BY total_revenue DESC;

-- Query 5: Customer analysis - users who bought PRODUCT_1
SELECT 
    u.email,
    u.first_name,
    u.last_name,
    COUNT(o.id) as total_orders,
    SUM(o.total_amount) as total_spent,
    MAX(o.order_date) as last_order_date,
    SUM(CASE WHEN oi.product_id = 1 THEN oi.quantity ELSE 0 END) as product_1_quantity
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN order_items oi ON o.id = oi.order_id
WHERE EXISTS (
    SELECT 1 
    FROM order_items oi2 
    JOIN orders o2 ON oi2.order_id = o2.id
    WHERE oi2.product_id = 1 
    AND o2.user_id = u.id
)
GROUP BY u.id, u.email, u.first_name, u.last_name
ORDER BY total_spent DESC;

-- Query 6: Weekly sales trend
SELECT 
    strftime('%Y-%W', o.order_date) as week_year,
    strftime('%Y-%m-%d', DATE(o.order_date, 'weekday 0', '-6 days')) as week_start,
    strftime('%Y-%m-%d', DATE(o.order_date, 'weekday 0')) as week_end,
    SUM(o.total_amount) as weekly_sales,
    COUNT(o.id) as weekly_orders,
    COUNT(DISTINCT o.user_id) as unique_customers
FROM orders o
WHERE o.status IN ('delivered', 'shipped', 'pending')
GROUP BY strftime('%Y-%W', o.order_date)
ORDER BY week_year DESC;

-- Query 7: Monthly sales summary
SELECT 
    strftime('%Y-%m', o.order_date) as month_year,
    SUM(o.total_amount) as monthly_sales,
    COUNT(o.id) as monthly_orders,
    COUNT(DISTINCT o.user_id) as unique_customers,
    AVG(o.total_amount) as avg_order_value
FROM orders o
WHERE o.status IN ('delivered', 'shipped', 'pending')
GROUP BY strftime('%Y-%m', o.order_date)
ORDER BY month_year DESC;

-- ========================================
-- Fleet Management Queries (Devices)
-- ========================================

-- Query 8: Device assignment overview
SELECT
    u.first_name || ' ' || u.last_name as employee_name,
    u.email,
    COUNT(d.id) as total_devices,
    GROUP_CONCAT(d.name || ' (' || d.type || ')', ', ') as assigned_devices
FROM users u
LEFT JOIN devices d ON u.id = d.employeeId
GROUP BY u.id, u.first_name, u.last_name, u.email
ORDER BY total_devices DESC, employee_name;

-- Query 9: Device inventory by type
SELECT
    d.type as device_type,
    COUNT(*) as total_count,
    COUNT(d.employeeId) as assigned_count,
    COUNT(*) - COUNT(d.employeeId) as unassigned_count
FROM devices d
GROUP BY d.type
ORDER BY total_count DESC;

-- Query 10: Unassigned devices
SELECT
    d.id,
    d.name,
    d.type,
    d.createdAt
FROM devices d
WHERE d.employeeId IS NULL
ORDER BY d.type, d.name;

-- Query 11: Employees with their device counts (for fleet management)
SELECT
    u.first_name || ' ' || u.last_name as employee_name,
    u.email,
    COUNT(d.id) as device_count,
    COUNT(o.id) as order_count,
    COALESCE(SUM(o.total_amount), 0) as total_purchases
FROM users u
LEFT JOIN devices d ON u.id = d.employeeId
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.first_name, u.last_name, u.email
ORDER BY device_count DESC, total_purchases DESC;

-- Query 12: Device utilization summary
SELECT
    'Total Devices' as metric,
    COUNT(*) as count
FROM devices
UNION ALL
SELECT
    'Assigned Devices' as metric,
    COUNT(*) as count
FROM devices
WHERE employeeId IS NOT NULL
UNION ALL
SELECT
    'Unassigned Devices' as metric,
    COUNT(*) as count
FROM devices
WHERE employeeId IS NULL
UNION ALL
SELECT
    'Total Users/Employees' as metric,
    COUNT(*) as count
FROM users;