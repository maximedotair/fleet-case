import { prisma } from "@/lib/database";
import { Device, DeviceWithEmployee, CreateDeviceData, UpdateDeviceData } from "@/domain/entities/Device";

export interface IDeviceRepository {
  findAll(): Promise<DeviceWithEmployee[]>;
  findById(id: string): Promise<DeviceWithEmployee | null>;
  create(data: CreateDeviceData): Promise<Device>;
  update(id: string, data: UpdateDeviceData): Promise<Device>;
  delete(id: string): Promise<void>;
  findByType(type: string): Promise<DeviceWithEmployee[]>;
  findByUserId(userId: string): Promise<Device[]>;
  findUnassigned(): Promise<DeviceWithEmployee[]>;
}

export class DeviceRepository implements IDeviceRepository {
  async findAll(): Promise<DeviceWithEmployee[]> {
    const devices = await prisma.device.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Récupérer tous les users une seule fois
    const users = await prisma.users.findMany();
    const userMap = new Map(users.map(user => [user.id.toString(), user]));

    const roles = ['Developer', 'UX Designer', 'Secretary', 'Manager', 'DevOps', 'Product Manager', 'Data Analyst', 'QA Engineer'];
    
    return devices.map(device => ({
      ...device,
      employee: device.employeeId && userMap.has(device.employeeId) ? {
        id: device.employeeId,
        name: `${userMap.get(device.employeeId)!.first_name} ${userMap.get(device.employeeId)!.last_name}`,
        role: roles[(parseInt(device.employeeId) - 1) % roles.length],
      } : null,
    }));
  }

  async findById(id: string): Promise<DeviceWithEmployee | null> {
    const device = await prisma.device.findUnique({
      where: { id },
    });

    if (!device) return null;

    let employee = null;
    if (device.employeeId) {
      const user = await prisma.users.findUnique({
        where: { id: parseInt(device.employeeId) },
      });
      if (user) {
        const roles = ['Developer', 'UX Designer', 'Secretary', 'Manager', 'DevOps', 'Product Manager', 'Data Analyst', 'QA Engineer'];
        employee = {
          id: device.employeeId,
          name: `${user.first_name} ${user.last_name}`,
          role: roles[(user.id - 1) % roles.length],
        };
      }
    }
    
    return {
      ...device,
      employee,
    };
  }

  async create(data: CreateDeviceData): Promise<Device> {
    return await prisma.device.create({
      data,
    });
  }

  async update(id: string, data: UpdateDeviceData): Promise<Device> {
    return await prisma.device.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.device.delete({
      where: { id },
    });
  }

  async findByType(type: string): Promise<DeviceWithEmployee[]> {
    const devices = await prisma.device.findMany({
      where: {
        type: {
          contains: type,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Récupérer tous les users une seule fois
    const users = await prisma.users.findMany();
    const userMap = new Map(users.map(user => [user.id.toString(), user]));

    const roles = ['Developer', 'UX Designer', 'Secretary', 'Manager', 'DevOps', 'Product Manager', 'Data Analyst', 'QA Engineer'];
    
    return devices.map(device => ({
      ...device,
      employee: device.employeeId && userMap.has(device.employeeId) ? {
        id: device.employeeId,
        name: `${userMap.get(device.employeeId)!.first_name} ${userMap.get(device.employeeId)!.last_name}`,
        role: roles[(parseInt(device.employeeId) - 1) % roles.length],
      } : null,
    }));
  }

  async findByUserId(userId: string): Promise<Device[]> {
    return await prisma.device.findMany({
      where: { employeeId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findUnassigned(): Promise<DeviceWithEmployee[]> {
    const devices = await prisma.device.findMany({
      where: { employeeId: null },
      orderBy: { createdAt: 'desc' },
    });

    return devices.map(device => ({
      ...device,
      employee: null, // Pas d'utilisateur assigné
    }));
  }
}