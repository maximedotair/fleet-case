import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.order_items.deleteMany();
  await prisma.orders.deleteMany();
  await prisma.products.deleteMany();
  await prisma.users.deleteMany();
  await prisma.device.deleteMany();

  console.log('🧹 Nettoyage des données existantes...');

  // Seed Users - exactement comme dans structure.sql
  const users = await Promise.all([
    prisma.users.create({
      data: {
        email: 'john.doe@example.com',
        first_name: 'John',
        last_name: 'Doe',
        phone: '+33123456789',
        address: '123 Rue de Rivoli, 75001 Paris',
      },
    }),
    prisma.users.create({
      data: {
        email: 'jane.smith@example.com',
        first_name: 'Jane',
        last_name: 'Smith',
        phone: '+33987654321',
        address: '456 Avenue des Champs-Élysées, 75008 Paris',
      },
    }),
    prisma.users.create({
      data: {
        email: 'pierre.martin@example.com',
        first_name: 'Pierre',
        last_name: 'Martin',
        phone: '+33555123456',
        address: '789 Boulevard Saint-Germain, 75007 Paris',
      },
    }),
    prisma.users.create({
      data: {
        email: 'marie.dubois@example.com',
        first_name: 'Marie',
        last_name: 'Dubois',
        phone: '+33444987654',
        address: '321 Rue de la Paix, 75002 Paris',
      },
    }),
    prisma.users.create({
      data: {
        email: 'luc.bernard@example.com',
        first_name: 'Luc',
        last_name: 'Bernard',
        phone: '+33333456789',
        address: '654 Avenue Montaigne, 75008 Paris',
      },
    }),
    prisma.users.create({
      data: {
        email: 'sophie.rousseau@example.com',
        first_name: 'Sophie',
        last_name: 'Rousseau',
        phone: '+33222123456',
        address: '987 Rue du Faubourg Saint-Honoré, 75008 Paris',
      },
    }),
    prisma.users.create({
      data: {
        email: 'thomas.petit@example.com',
        first_name: 'Thomas',
        last_name: 'Petit',
        phone: '+33111987654',
        address: '147 Boulevard Haussmann, 75008 Paris',
      },
    }),
    prisma.users.create({
      data: {
        email: 'emma.robert@example.com',
        first_name: 'Emma',
        last_name: 'Robert',
        phone: '+33666123456',
        address: '258 Rue de Babylone, 75007 Paris',
      },
    }),
  ]);

  console.log(`👥 Utilisateurs créés: ${users.length}`);

  // Seed Devices - exactement comme dans structure.sql
  const devices = await Promise.all([
    prisma.device.create({
      data: {
        id: 'dev_001_laptop',
        name: 'MacBook Pro 16"',
        type: 'Laptop',
        employeeId: '1',
      },
    }),
    prisma.device.create({
      data: {
        id: 'dev_002_phone',
        name: 'iPhone 15 Pro',
        type: 'Phone',
        employeeId: '1',
      },
    }),
    prisma.device.create({
      data: {
        id: 'dev_003_laptop',
        name: 'Dell XPS 13',
        type: 'Laptop',
        employeeId: '2',
      },
    }),
    prisma.device.create({
      data: {
        id: 'dev_004_desktop',
        name: 'iMac 24"',
        type: 'Desktop',
        employeeId: '3',
      },
    }),
    prisma.device.create({
      data: {
        id: 'dev_005_tablet',
        name: 'iPad Pro 12.9"',
        type: 'Tablet',
        employeeId: '2',
      },
    }),
    prisma.device.create({
      data: {
        id: 'dev_006_laptop',
        name: 'ThinkPad X1 Carbon',
        type: 'Laptop',
        employeeId: '4',
      },
    }),
    prisma.device.create({
      data: {
        id: 'dev_007_monitor',
        name: 'LG UltraWide 34"',
        type: 'Monitor',
        employeeId: '3',
      },
    }),
    prisma.device.create({
      data: {
        id: 'dev_008_phone',
        name: 'Samsung Galaxy S24',
        type: 'Phone',
        employeeId: '5',
      },
    }),
    prisma.device.create({
      data: {
        id: 'dev_009_laptop',
        name: 'MacBook Air M3',
        type: 'Laptop',
        employeeId: '6',
      },
    }),
    prisma.device.create({
      data: {
        id: 'dev_010_peripheral',
        name: 'Wireless Keyboard & Mouse',
        type: 'Peripheral',
        employeeId: '4',
      },
    }),
  ]);

  console.log(`📱 Appareils créés: ${devices.length}`);

  // Seed Products - exactement comme dans structure.sql
  const products = await Promise.all([
    prisma.products.create({
      data: {
        name: 'PRODUCT_1',
        description: 'Premium Wireless Headphones',
        price: 149.99,
        stock_quantity: 50,
        category: 'Electronics',
        sku: 'ELEC-HEAD-001',
      },
    }),
    prisma.products.create({
      data: {
        name: 'PRODUCT_2',
        description: 'Ergonomic Office Chair',
        price: 299.99,
        stock_quantity: 25,
        category: 'Furniture',
        sku: 'FURN-CHAIR-001',
      },
    }),
    prisma.products.create({
      data: {
        name: 'PRODUCT_3',
        description: 'Smart Watch Series X',
        price: 399.99,
        stock_quantity: 30,
        category: 'Electronics',
        sku: 'ELEC-WATCH-001',
      },
    }),
    prisma.products.create({
      data: {
        name: 'PRODUCT_4',
        description: 'Professional Coffee Machine',
        price: 599.99,
        stock_quantity: 15,
        category: 'Appliances',
        sku: 'APPL-COFFEE-001',
      },
    }),
    prisma.products.create({
      data: {
        name: 'PRODUCT_5',
        description: 'Wireless Mechanical Keyboard',
        price: 179.99,
        stock_quantity: 40,
        category: 'Electronics',
        sku: 'ELEC-KEYB-001',
      },
    }),
    prisma.products.create({
      data: {
        name: 'PRODUCT_6',
        description: 'Standing Desk Converter',
        price: 249.99,
        stock_quantity: 20,
        category: 'Furniture',
        sku: 'FURN-DESK-001',
      },
    }),
    prisma.products.create({
      data: {
        name: 'PRODUCT_7',
        description: 'Bluetooth Speaker Pro',
        price: 89.99,
        stock_quantity: 60,
        category: 'Electronics',
        sku: 'ELEC-SPEAK-001',
      },
    }),
    prisma.products.create({
      data: {
        name: 'PRODUCT_8',
        description: 'Laptop Backpack Premium',
        price: 79.99,
        stock_quantity: 100,
        category: 'Accessories',
        sku: 'ACC-BAG-001',
      },
    }),
    prisma.products.create({
      data: {
        name: 'PRODUCT_9',
        description: 'Wireless Mouse Elite',
        price: 59.99,
        stock_quantity: 80,
        category: 'Electronics',
        sku: 'ELEC-MOUSE-001',
      },
    }),
    prisma.products.create({
      data: {
        name: 'PRODUCT_10',
        description: 'USB-C Hub Multi-Port',
        price: 49.99,
        stock_quantity: 75,
        category: 'Electronics',
        sku: 'ELEC-HUB-001',
      },
    }),
  ]);

  console.log(`🛍️ Produits créés: ${products.length}`);

  // Calculer les dates comme dans structure.sql
  const now = new Date();
  const getDaysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  // Seed Orders - exactement comme dans structure.sql avec toutes les 15 commandes
  const orders = await Promise.all([
    // Recent orders (last 7 days) with PRODUCT_1
    prisma.orders.create({
      data: {
        user_id: users[0].id, // user 1
        order_number: 'ORD-2024-001',
        status: 'delivered',
        total_amount: 149.99,
        shipping_address: '123 Rue de Rivoli, 75001 Paris',
        order_date: getDaysAgo(2),
      },
    }),
    prisma.orders.create({
      data: {
        user_id: users[1].id, // user 2
        order_number: 'ORD-2024-002',
        status: 'shipped',
        total_amount: 329.98,
        shipping_address: '456 Avenue des Champs-Élysées, 75008 Paris',
        order_date: getDaysAgo(4),
      },
    }),
    prisma.orders.create({
      data: {
        user_id: users[2].id, // user 3
        order_number: 'ORD-2024-003',
        status: 'pending',
        total_amount: 149.99,
        shipping_address: '789 Boulevard Saint-Germain, 75007 Paris',
        order_date: getDaysAgo(1),
      },
    }),
    prisma.orders.create({
      data: {
        user_id: users[4].id, // user 5
        order_number: 'ORD-2024-004',
        status: 'delivered',
        total_amount: 449.98,
        shipping_address: '654 Avenue Montaigne, 75008 Paris',
        order_date: getDaysAgo(6),
      },
    }),
    prisma.orders.create({
      data: {
        user_id: users[6].id, // user 7
        order_number: 'ORD-2024-005',
        status: 'delivered',
        total_amount: 239.98,
        shipping_address: '147 Boulevard Haussmann, 75008 Paris',
        order_date: getDaysAgo(3),
      },
    }),
    // Older orders for historical data
    prisma.orders.create({
      data: {
        user_id: users[3].id, // user 4
        order_number: 'ORD-2024-006',
        status: 'delivered',
        total_amount: 599.99,
        shipping_address: '321 Rue de la Paix, 75002 Paris',
        order_date: getDaysAgo(15),
      },
    }),
    prisma.orders.create({
      data: {
        user_id: users[5].id, // user 6
        order_number: 'ORD-2024-007',
        status: 'delivered',
        total_amount: 179.99,
        shipping_address: '987 Rue du Faubourg Saint-Honoré, 75008 Paris',
        order_date: getDaysAgo(20),
      },
    }),
    prisma.orders.create({
      data: {
        user_id: users[7].id, // user 8
        order_number: 'ORD-2024-008',
        status: 'delivered',
        total_amount: 129.98,
        shipping_address: '258 Rue de Babylone, 75007 Paris',
        order_date: getDaysAgo(25),
      },
    }),
    prisma.orders.create({
      data: {
        user_id: users[0].id, // user 1
        order_number: 'ORD-2024-009',
        status: 'delivered',
        total_amount: 299.99,
        shipping_address: '123 Rue de Rivoli, 75001 Paris',
        order_date: getDaysAgo(30),
      },
    }),
    prisma.orders.create({
      data: {
        user_id: users[1].id, // user 2
        order_number: 'ORD-2024-010',
        status: 'delivered',
        total_amount: 89.99,
        shipping_address: '456 Avenue des Champs-Élysées, 75008 Paris',
        order_date: getDaysAgo(35),
      },
    }),
    // Additional orders for sales pattern analysis
    prisma.orders.create({
      data: {
        user_id: users[2].id, // user 3
        order_number: 'ORD-2024-011',
        status: 'delivered',
        total_amount: 379.98,
        shipping_address: '789 Boulevard Saint-Germain, 75007 Paris',
        order_date: getDaysAgo(10),
      },
    }),
    prisma.orders.create({
      data: {
        user_id: users[3].id, // user 4
        order_number: 'ORD-2024-012',
        status: 'delivered',
        total_amount: 519.98,
        shipping_address: '321 Rue de la Paix, 75002 Paris',
        order_date: getDaysAgo(12),
      },
    }),
    prisma.orders.create({
      data: {
        user_id: users[4].id, // user 5
        order_number: 'ORD-2024-013',
        status: 'delivered',
        total_amount: 229.98,
        shipping_address: '654 Avenue Montaigne, 75008 Paris',
        order_date: getDaysAgo(8),
      },
    }),
    prisma.orders.create({
      data: {
        user_id: users[5].id, // user 6
        order_number: 'ORD-2024-014',
        status: 'delivered',
        total_amount: 199.98,
        shipping_address: '987 Rue du Faubourg Saint-Honoré, 75008 Paris',
        order_date: getDaysAgo(5),
      },
    }),
    prisma.orders.create({
      data: {
        user_id: users[6].id, // user 7
        order_number: 'ORD-2024-015',
        status: 'delivered',
        total_amount: 149.99,
        shipping_address: '147 Boulevard Haussmann, 75008 Paris',
        order_date: getDaysAgo(7),
      },
    }),
  ]);

  console.log(`📦 Commandes créées: ${orders.length}`);

  // Seed Order Items - exactement comme dans structure.sql
  await Promise.all([
    // Order 1: PRODUCT_1 (recent)
    prisma.order_items.create({
      data: {
        order_id: orders[0].id,
        product_id: products[0].id,
        quantity: 1,
        unit_price: 149.99,
        total_price: 149.99,
      },
    }),

    // Order 2: PRODUCT_1 + PRODUCT_7 (recent)
    prisma.order_items.create({
      data: {
        order_id: orders[1].id,
        product_id: products[0].id,
        quantity: 1,
        unit_price: 149.99,
        total_price: 149.99,
      },
    }),
    prisma.order_items.create({
      data: {
        order_id: orders[1].id,
        product_id: products[6].id,
        quantity: 2,
        unit_price: 89.99,
        total_price: 179.99,
      },
    }),

    // Order 3: PRODUCT_1 (recent)
    prisma.order_items.create({
      data: {
        order_id: orders[2].id,
        product_id: products[0].id,
        quantity: 1,
        unit_price: 149.99,
        total_price: 149.99,
      },
    }),

    // Order 4: PRODUCT_1 + PRODUCT_5 (recent)
    prisma.order_items.create({
      data: {
        order_id: orders[3].id,
        product_id: products[0].id,
        quantity: 2,
        unit_price: 149.99,
        total_price: 299.98,
      },
    }),
    prisma.order_items.create({
      data: {
        order_id: orders[3].id,
        product_id: products[4].id,
        quantity: 1,
        unit_price: 149.99,
        total_price: 149.99,
      },
    }),

    // Order 5: PRODUCT_7 + PRODUCT_9 (recent)
    prisma.order_items.create({
      data: {
        order_id: orders[4].id,
        product_id: products[6].id,
        quantity: 1,
        unit_price: 89.99,
        total_price: 89.99,
      },
    }),
    prisma.order_items.create({
      data: {
        order_id: orders[4].id,
        product_id: products[8].id,
        quantity: 3,
        unit_price: 49.99,
        total_price: 149.99,
      },
    }),

    // Order 6: PRODUCT_4 (older)
    prisma.order_items.create({
      data: {
        order_id: orders[5].id,
        product_id: products[3].id,
        quantity: 1,
        unit_price: 599.99,
        total_price: 599.99,
      },
    }),

    // Order 7: PRODUCT_5 (older)
    prisma.order_items.create({
      data: {
        order_id: orders[6].id,
        product_id: products[4].id,
        quantity: 1,
        unit_price: 179.99,
        total_price: 179.99,
      },
    }),

    // Order 8: PRODUCT_8 + PRODUCT_10 (older)
    prisma.order_items.create({
      data: {
        order_id: orders[7].id,
        product_id: products[7].id,
        quantity: 1,
        unit_price: 79.99,
        total_price: 79.99,
      },
    }),
    prisma.order_items.create({
      data: {
        order_id: orders[7].id,
        product_id: products[9].id,
        quantity: 1,
        unit_price: 49.99,
        total_price: 49.99,
      },
    }),

    // Order 9: PRODUCT_2 (older)
    prisma.order_items.create({
      data: {
        order_id: orders[8].id,
        product_id: products[1].id,
        quantity: 1,
        unit_price: 299.99,
        total_price: 299.99,
      },
    }),

    // Order 10: PRODUCT_7 (older)
    prisma.order_items.create({
      data: {
        order_id: orders[9].id,
        product_id: products[6].id,
        quantity: 1,
        unit_price: 89.99,
        total_price: 89.99,
      },
    }),

    // Order 11: PRODUCT_3 + PRODUCT_1
    prisma.order_items.create({
      data: {
        order_id: orders[10].id,
        product_id: products[2].id,
        quantity: 1,
        unit_price: 399.99,
        total_price: 399.99,
      },
    }),
    prisma.order_items.create({
      data: {
        order_id: orders[10].id,
        product_id: products[0].id,
        quantity: 1,
        unit_price: 149.99,
        total_price: 149.99,
      },
    }),

    // Order 12: PRODUCT_4 + PRODUCT_6
    prisma.order_items.create({
      data: {
        order_id: orders[11].id,
        product_id: products[3].id,
        quantity: 1,
        unit_price: 599.99,
        total_price: 599.99,
      },
    }),
    prisma.order_items.create({
      data: {
        order_id: orders[11].id,
        product_id: products[5].id,
        quantity: 1,
        unit_price: 249.99,
        total_price: 249.99,
      },
    }),

    // Order 13: PRODUCT_7 + PRODUCT_9
    prisma.order_items.create({
      data: {
        order_id: orders[12].id,
        product_id: products[6].id,
        quantity: 1,
        unit_price: 89.99,
        total_price: 89.99,
      },
    }),
    prisma.order_items.create({
      data: {
        order_id: orders[12].id,
        product_id: products[8].id,
        quantity: 2,
        unit_price: 59.99,
        total_price: 119.99,
      },
    }),

    // Order 14: PRODUCT_8 + PRODUCT_10
    prisma.order_items.create({
      data: {
        order_id: orders[13].id,
        product_id: products[7].id,
        quantity: 1,
        unit_price: 79.99,
        total_price: 79.99,
      },
    }),
    prisma.order_items.create({
      data: {
        order_id: orders[13].id,
        product_id: products[9].id,
        quantity: 2,
        unit_price: 49.99,
        total_price: 99.99,
      },
    }),

    // Order 15: PRODUCT_1 (recent)
    prisma.order_items.create({
      data: {
        order_id: orders[14].id,
        product_id: products[0].id,
        quantity: 1,
        unit_price: 149.99,
        total_price: 149.99,
      },
    }),
  ]);

  console.log('✅ Base de données remplie avec succès !');
  console.log(`📊 Résumé des données créées :`);
  console.log(`   👥 Utilisateurs: ${users.length}`);
  console.log(`   📱 Appareils: ${devices.length}`);
  console.log(`   🛍️ Produits: ${products.length}`);
  console.log(`   📦 Commandes: ${orders.length}`);
  console.log(`   📝 Articles de commande: Multiples`);
  console.log(`🎯 Toutes les données sont identiques au fichier structure.sql`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });