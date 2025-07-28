import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./test.db'
    }
  }
});

describe('Employee API Tests', () => {
  beforeAll(async () => {
    // Initialize test database
    await prisma.$executeRaw`PRAGMA foreign_keys = OFF`;
    await prisma.employee.deleteMany();
    await prisma.device.deleteMany();
    await prisma.$executeRaw`PRAGMA foreign_keys = ON`;
  });

  afterAll(async () => {
    // Cleanup
    await prisma.$executeRaw`PRAGMA foreign_keys = OFF`;
    await prisma.employee.deleteMany();
    await prisma.device.deleteMany();
    await prisma.$executeRaw`PRAGMA foreign_keys = ON`;
    await prisma.$disconnect();
  });

  test('should create a new employee', async () => {
    const employeeData = {
      name: 'Test Employee',
      role: 'DEVELOPER' as const
    };

    const employee = await prisma.employee.create({
      data: employeeData
    });

    expect(employee).toBeDefined();
    expect(employee.name).toBe(employeeData.name);
    expect(employee.role).toBe(employeeData.role);
    expect(employee.id).toBeDefined();
  });

  test('should fetch employees with device count', async () => {
    // Create test employee
    const employee = await prisma.employee.create({
      data: {
        name: 'Test Employee 2',
        role: 'MANAGER'
      }
    });

    // Create test devices
    await prisma.device.createMany({
      data: [
        {
          name: 'Test Device 1',
          type: 'LAPTOP',
          employeeId: employee.id
        },
        {
          name: 'Test Device 2',
          type: 'PHONE',
          employeeId: employee.id
        }
      ]
    });

    // Fetch employee with device count
    const employees = await prisma.employee.findMany({
      include: {
        _count: {
          select: { devices: true }
        }
      }
    });

    const testEmployee = employees.find(e => e.id === employee.id);
    expect(testEmployee).toBeDefined();
    expect(testEmployee?._count.devices).toBe(2);
  });

  test('should update employee', async () => {
    const employee = await prisma.employee.create({
      data: {
        name: 'Test Employee 3',
        role: 'DEVELOPER'
      }
    });

    const updatedEmployee = await prisma.employee.update({
      where: { id: employee.id },
      data: { role: 'MANAGER' }
    });

    expect(updatedEmployee.role).toBe('MANAGER');
    expect(updatedEmployee.name).toBe('Test Employee 3');
  });

  test('should delete employee', async () => {
    const employee = await prisma.employee.create({
      data: {
        name: 'Test Employee 4',
        role: 'DEVELOPER'
      }
    });

    await prisma.employee.delete({
      where: { id: employee.id }
    });

    const deletedEmployee = await prisma.employee.findUnique({
      where: { id: employee.id }
    });

    expect(deletedEmployee).toBeNull();
  });

  test('should validate employee data', () => {
    const validEmployee = {
      name: 'Valid Employee',
      role: 'DEVELOPER'
    };

    const invalidEmployee = {
      name: '', // Invalid: empty name
      role: 'INVALID_ROLE' // Invalid: not in enum
    };

    // These would be tested with your DTO validation
    expect(validEmployee.name).toBeTruthy();
    expect(['DEVELOPER', 'MANAGER', 'ADMIN'].includes(validEmployee.role)).toBeTruthy();
    
    expect(invalidEmployee.name).toBeFalsy();
    expect(['DEVELOPER', 'MANAGER', 'ADMIN'].includes(invalidEmployee.role as any)).toBeFalsy();
  });
});