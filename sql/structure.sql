-- E-commerce Database Structure
-- Created for Fleet Management Technical Test

-- Users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    category VARCHAR(100),
    sku VARCHAR(100) UNIQUE,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_address TEXT,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    shipped_date DATETIME NULL,
    delivered_date DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order items table (for order details)
CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Devices table (Employee/Fleet management)
CREATE TABLE devices (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    employeeId TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sample Users Data
INSERT INTO users (email, first_name, last_name, phone, address) VALUES
('john.doe@example.com', 'John', 'Doe', '+33123456789', '123 Rue de Rivoli, 75001 Paris'),
('jane.smith@example.com', 'Jane', 'Smith', '+33987654321', '456 Avenue des Champs-Élysées, 75008 Paris'),
('pierre.martin@example.com', 'Pierre', 'Martin', '+33555123456', '789 Boulevard Saint-Germain, 75007 Paris'),
('marie.dubois@example.com', 'Marie', 'Dubois', '+33444987654', '321 Rue de la Paix, 75002 Paris'),
('luc.bernard@example.com', 'Luc', 'Bernard', '+33333456789', '654 Avenue Montaigne, 75008 Paris'),
('sophie.rousseau@example.com', 'Sophie', 'Rousseau', '+33222123456', '987 Rue du Faubourg Saint-Honoré, 75008 Paris'),
('thomas.petit@example.com', 'Thomas', 'Petit', '+33111987654', '147 Boulevard Haussmann, 75008 Paris'),
('emma.robert@example.com', 'Emma', 'Robert', '+33666123456', '258 Rue de Babylone, 75007 Paris');

-- Sample Devices Data
INSERT INTO devices (id, name, type, employeeId, createdAt, updatedAt) VALUES
('dev_001_laptop', 'MacBook Pro 16"', 'Laptop', '1', datetime('now'), datetime('now')),
('dev_002_phone', 'iPhone 15 Pro', 'Phone', '1', datetime('now'), datetime('now')),
('dev_003_laptop', 'Dell XPS 13', 'Laptop', '2', datetime('now'), datetime('now')),
('dev_004_desktop', 'iMac 24"', 'Desktop', '3', datetime('now'), datetime('now')),
('dev_005_tablet', 'iPad Pro 12.9"', 'Tablet', '2', datetime('now'), datetime('now')),
('dev_006_laptop', 'ThinkPad X1 Carbon', 'Laptop', '4', datetime('now'), datetime('now')),
('dev_007_monitor', 'LG UltraWide 34"', 'Monitor', '3', datetime('now'), datetime('now')),
('dev_008_phone', 'Samsung Galaxy S24', 'Phone', '5', datetime('now'), datetime('now')),
('dev_009_laptop', 'MacBook Air M3', 'Laptop', '6', datetime('now'), datetime('now')),
('dev_010_peripheral', 'Wireless Keyboard & Mouse', 'Peripheral', '4', datetime('now'), datetime('now'));

-- Sample Products Data
INSERT INTO products (name, description, price, stock_quantity, category, sku) VALUES
('PRODUCT_1', 'Premium Wireless Headphones', 149.99, 50, 'Electronics', 'ELEC-HEAD-001'),
('PRODUCT_2', 'Ergonomic Office Chair', 299.99, 25, 'Furniture', 'FURN-CHAIR-001'),
('PRODUCT_3', 'Smart Watch Series X', 399.99, 30, 'Electronics', 'ELEC-WATCH-001'),
('PRODUCT_4', 'Professional Coffee Machine', 599.99, 15, 'Appliances', 'APPL-COFFEE-001'),
('PRODUCT_5', 'Wireless Mechanical Keyboard', 179.99, 40, 'Electronics', 'ELEC-KEYB-001'),
('PRODUCT_6', 'Standing Desk Converter', 249.99, 20, 'Furniture', 'FURN-DESK-001'),
('PRODUCT_7', 'Bluetooth Speaker Pro', 89.99, 60, 'Electronics', 'ELEC-SPEAK-001'),
('PRODUCT_8', 'Laptop Backpack Premium', 79.99, 100, 'Accessories', 'ACC-BAG-001'),
('PRODUCT_9', 'Wireless Mouse Elite', 59.99, 80, 'Electronics', 'ELEC-MOUSE-001'),
('PRODUCT_10', 'USB-C Hub Multi-Port', 49.99, 75, 'Electronics', 'ELEC-HUB-001');

-- Sample Orders Data (including recent orders for PRODUCT_1)
INSERT INTO orders (user_id, order_number, status, total_amount, shipping_address, order_date) VALUES
-- Recent orders (last 7 days) with PRODUCT_1
(1, 'ORD-2024-001', 'delivered', 149.99, '123 Rue de Rivoli, 75001 Paris', datetime('now', '-2 days')),
(2, 'ORD-2024-002', 'shipped', 329.98, '456 Avenue des Champs-Élysées, 75008 Paris', datetime('now', '-4 days')),
(3, 'ORD-2024-003', 'pending', 149.99, '789 Boulevard Saint-Germain, 75007 Paris', datetime('now', '-1 day')),
(5, 'ORD-2024-004', 'delivered', 449.98, '654 Avenue Montaigne, 75008 Paris', datetime('now', '-6 days')),
(7, 'ORD-2024-005', 'delivered', 239.98, '147 Boulevard Haussmann, 75008 Paris', datetime('now', '-3 days')),

-- Older orders for historical data
(4, 'ORD-2024-006', 'delivered', 599.99, '321 Rue de la Paix, 75002 Paris', datetime('now', '-15 days')),
(6, 'ORD-2024-007', 'delivered', 179.99, '987 Rue du Faubourg Saint-Honoré, 75008 Paris', datetime('now', '-20 days')),
(8, 'ORD-2024-008', 'delivered', 129.98, '258 Rue de Babylone, 75007 Paris', datetime('now', '-25 days')),
(1, 'ORD-2024-009', 'delivered', 299.99, '123 Rue de Rivoli, 75001 Paris', datetime('now', '-30 days')),
(2, 'ORD-2024-010', 'delivered', 89.99, '456 Avenue des Champs-Élysées, 75008 Paris', datetime('now', '-35 days')),

-- Additional orders for sales pattern analysis
(3, 'ORD-2024-011', 'delivered', 379.98, '789 Boulevard Saint-Germain, 75007 Paris', datetime('now', '-10 days')),
(4, 'ORD-2024-012', 'delivered', 519.98, '321 Rue de la Paix, 75002 Paris', datetime('now', '-12 days')),
(5, 'ORD-2024-013', 'delivered', 229.98, '654 Avenue Montaigne, 75008 Paris', datetime('now', '-8 days')),
(6, 'ORD-2024-014', 'delivered', 199.98, '987 Rue du Faubourg Saint-Honoré, 75008 Paris', datetime('now', '-5 days')),
(7, 'ORD-2024-015', 'delivered', 149.99, '147 Boulevard Haussmann, 75008 Paris', datetime('now', '-7 days'));

-- Sample Order Items Data
INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES
-- Order 1: PRODUCT_1 (recent)
(1, 1, 1, 149.99, 149.99),

-- Order 2: PRODUCT_1 + PRODUCT_7 (recent)
(2, 1, 1, 149.99, 149.99),
(2, 7, 2, 89.99, 179.99),

-- Order 3: PRODUCT_1 (recent)
(3, 1, 1, 149.99, 149.99),

-- Order 4: PRODUCT_1 + PRODUCT_5 (recent)
(4, 1, 2, 149.99, 299.98),
(4, 5, 1, 149.99, 149.99),

-- Order 5: PRODUCT_7 + PRODUCT_9 (recent)
(5, 7, 1, 89.99, 89.99),
(5, 9, 3, 49.99, 149.99),

-- Order 6: PRODUCT_4 (older)
(6, 4, 1, 599.99, 599.99),

-- Order 7: PRODUCT_5 (older)
(7, 5, 1, 179.99, 179.99),

-- Order 8: PRODUCT_8 + PRODUCT_10 (older)
(8, 8, 1, 79.99, 79.99),
(8, 10, 1, 49.99, 49.99),

-- Order 9: PRODUCT_2 (older)
(9, 2, 1, 299.99, 299.99),

-- Order 10: PRODUCT_7 (older)
(10, 7, 1, 89.99, 89.99),

-- Order 11: PRODUCT_3 + PRODUCT_1
(11, 3, 1, 399.99, 399.99),
(11, 1, 1, 149.99, 149.99),

-- Order 12: PRODUCT_4 + PRODUCT_6
(12, 4, 1, 599.99, 599.99),
(12, 6, 1, 249.99, 249.99),

-- Order 13: PRODUCT_7 + PRODUCT_9
(13, 7, 1, 89.99, 89.99),
(13, 9, 2, 59.99, 119.99),

-- Order 14: PRODUCT_8 + PRODUCT_10
(14, 8, 1, 79.99, 79.99),
(14, 10, 2, 49.99, 99.99),

-- Order 15: PRODUCT_1 (recent)
(15, 1, 1, 149.99, 149.99);

-- Create indexes for better performance
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_date ON orders(order_date);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_sku ON products(sku);

-- Indexes for devices table
CREATE INDEX idx_devices_employeeId ON devices(employeeId);
CREATE INDEX idx_devices_type ON devices(type);

-- Create view for order summary
CREATE VIEW order_summary AS
SELECT 
    o.id as order_id,
    o.order_number,
    u.email,
    u.first_name,
    u.last_name,
    o.order_date,
    o.total_amount,
    o.status,
    COUNT(oi.id) as item_count
FROM orders o
JOIN users u ON o.user_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, o.order_number, u.email, u.first_name, u.last_name, o.order_date, o.total_amount, o.status;