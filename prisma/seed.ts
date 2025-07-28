import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Seed Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+33123456789',
        address: '123 Rue de Rivoli, 75001 Paris',
      },
    }),
    prisma.user.create({
      data: {
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+33987654321',
        address: '456 Avenue des Champs-Élysées, 75008 Paris',
      },
    }),
    prisma.user.create({
      data: {
        email: 'pierre.martin@example.com',
        firstName: 'Pierre',
        lastName: 'Martin',
        phone: '+33555123456',
        address: '789 Boulevard Saint-Germain, 75007 Paris',
      },
    }),
    prisma.user.create({
      data: {
        email: 'marie.dubois@example.com',
        firstName: 'Marie',
        lastName: 'Dubois',
        phone: '+33444987654',
        address: '321 Rue de la Paix, 75002 Paris',
      },
    }),
    prisma.user.create({
      data: {
        email: 'luc.bernard@example.com',
        firstName: 'Luc',
        lastName: 'Bernard',
        phone: '+33333456789',
        address: '654 Avenue Montaigne, 75008 Paris',
      },
    }),
    prisma.user.create({
      data: {
        email: 'sophie.rousseau@example.com',
        firstName: 'Sophie',
        lastName: 'Rousseau',
        phone: '+33222123456',
        address: '987 Rue du Faubourg Saint-Honoré, 75008 Paris',
      },
    }),
    prisma.user.create({
      data: {
        email: 'thomas.petit@example.com',
        firstName: 'Thomas',
        lastName: 'Petit',
        phone: '+33111987654',
        address: '147 Boulevard Haussmann, 75008 Paris',
      },
    }),
    prisma.user.create({
      data: {
        email: 'emma.robert@example.com',
        firstName: 'Emma',
        lastName: 'Robert',
        phone: '+33666123456',
        address: '258 Rue de Babylone, 75007 Paris',
      },
    }),
  ]);

  // Seed Products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'PRODUCT_1',
        description: 'Premium Wireless Headphones',
        price: 149.99,
        stockQuantity: 50,
        category: 'Electronics',
        sku: 'ELEC-HEAD-001',
      },
    }),
    prisma.product.create({
      data: {
        name: 'PRODUCT_2',
        description: 'Ergonomic Office Chair',
        price: 299.99,
        stockQuantity: 25,
        category: 'Furniture',
        sku: 'FURN-CHAIR-001',
      },
    }),
    prisma.product.create({
      data: {
        name: 'PRODUCT_3',
        description: 'Smart Watch Series X',
        price: 399.99,
        stockQuantity: 30,
        category: 'Electronics',
        sku: 'ELEC-WATCH-001',
      },
    }),
    prisma.product.create({
      data: {
        name: 'PRODUCT_4',
        description: 'Professional Coffee Machine',
        price: 599.99,
        stockQuantity: 15,
        category: 'Appliances',
        sku: 'APPL-COFFEE-001',
      },
    }),
    prisma.product.create({
      data: {
        name: 'PRODUCT_5',
        description: 'Wireless Mechanical Keyboard',
        price: 179.99,
        stockQuantity: 40,
        category: 'Electronics',
        sku: 'ELEC-KEYB-001',
      },
    }),
    prisma.product.create({
      data: {
        name: 'PRODUCT_6',
        description: 'Standing Desk Converter',
        price: 249.99,
        stockQuantity: 20,
        category: 'Furniture',
        sku: 'FURN-DESK-001',
      },
    }),
    prisma.product.create({
      data: {
        name: 'PRODUCT_7',
        description: 'Bluetooth Speaker Pro',
        price: 89.99,
        stockQuantity: 60,
        category: 'Electronics',
        sku: 'ELEC-SPEAK-001',
      },
    }),
    prisma.product.create({
      data: {
        name: 'PRODUCT_8',
        description: 'Laptop Backpack Premium',
        price: 79.99,
        stockQuantity: 100,
        category: 'Accessories',
        sku: 'ACC-BAG-001',
      },
    }),
    prisma.product.create({
      data: {
        name: 'PRODUCT_9',
        description: 'Wireless Mouse Elite',
        price: 59.99,
        stockQuantity: 80,
        category: 'Electronics',
        sku: 'ELEC-MOUSE-001',
      },
    }),
    prisma.product.create({
      data: {
        name: 'PRODUCT_10',
        description: 'USB-C Hub Multi-Port',
        price: 49.99,
        stockQuantity: 75,
        category: 'Electronics',
        sku: 'ELEC-HUB-001',
      },
    }),
  ]);

  // Create orders with realistic dates
  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
  const sixDaysAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

  // Seed Orders
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        userId: users[0].id,
        orderNumber: 'ORD-2024-001',
        status: 'delivered',
        totalAmount: 149.99,
        shippingAddress: '123 Rue de Rivoli, 75001 Paris',
        orderDate: twoDaysAgo,
      },
    }),
    prisma.order.create({
      data: {
        userId: users[1].id,
        orderNumber: 'ORD-2024-002',
        status: 'shipped',
        totalAmount: 329.98,
        shippingAddress: '456 Avenue des Champs-Élysées, 75008 Paris',
        orderDate: fourDaysAgo,
      },
    }),
    prisma.order.create({
      data: {
        userId: users[2].id,
        orderNumber: 'ORD-2024-003',
        status: 'pending',
        totalAmount: 149.99,
        shippingAddress: '789 Boulevard Saint-Germain, 75007 Paris',
        orderDate: oneDayAgo,
      },
    }),
    prisma.order.create({
      data: {
        userId: users[4].id,
        orderNumber: 'ORD-2024-004',
        status: 'delivered',
        totalAmount: 449.98,
        shippingAddress: '654 Avenue Montaigne, 75008 Paris',
        orderDate: sixDaysAgo,
      },
    }),
    prisma.order.create({
      data: {
        userId: users[6].id,
        orderNumber: 'ORD-2024-005',
        status: 'delivered',
        totalAmount: 239.98,
        shippingAddress: '147 Boulevard Haussmann, 75008 Paris',
        orderDate: threeDaysAgo,
      },
    }),
  ]);

  // Seed Order Items
  await Promise.all([
    // Order 1: PRODUCT_1
    prisma.orderItem.create({
      data: {
        orderId: orders[0].id,
        productId: products[0].id,
        quantity: 1,
        unitPrice: 149.99,
        totalPrice: 149.99,
      },
    }),
    // Order 2: PRODUCT_1 + PRODUCT_7
    prisma.orderItem.create({
      data: {
        orderId: orders[1].id,
        productId: products[0].id,
        quantity: 1,
        unitPrice: 149.99,
        totalPrice: 149.99,
      },
    }),
    prisma.orderItem.create({
      data: {
        orderId: orders[1].id,
        productId: products[6].id,
        quantity: 2,
        unitPrice: 89.99,
        totalPrice: 179.99,
      },
    }),
    // Order 3: PRODUCT_1
    prisma.orderItem.create({
      data: {
        orderId: orders[2].id,
        productId: products[0].id,
        quantity: 1,
        unitPrice: 149.99,
        totalPrice: 149.99,
      },
    }),
    // Order 4: PRODUCT_1 + PRODUCT_5
    prisma.orderItem.create({
      data: {
        orderId: orders[3].id,
        productId: products[0].id,
        quantity: 2,
        unitPrice: 149.99,
        totalPrice: 299.98,
      },
    }),
    prisma.orderItem.create({
      data: {
        orderId: orders[3].id,
        productId: products[4].id,
        quantity: 1,
        unitPrice: 149.99,
        totalPrice: 149.99,
      },
    }),
    // Order 5: PRODUCT_7 + PRODUCT_9
    prisma.orderItem.create({
      data: {
        orderId: orders[4].id,
        productId: products[6].id,
        quantity: 1,
        unitPrice: 89.99,
        totalPrice: 89.99,
      },
    }),
    prisma.orderItem.create({
      data: {
        orderId: orders[4].id,
        productId: products[8].id,
        quantity: 3,
        unitPrice: 49.99,
        totalPrice: 149.99,
      },
    }),
  ]);

  console.log('✅ Database seeded successfully!');
  console.log(`📊 Created:`);
  console.log(`   - ${users.length} users`);
  console.log(`   - ${products.length} products`);
  console.log(`   - ${orders.length} orders`);
  console.log(`   - Multiple order items`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });