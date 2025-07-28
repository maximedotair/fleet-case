import { prisma } from "@/lib/database";
import { Employee, CreateEmployeeData, UpdateEmployeeData } from "@/domain/entities/Employee";

export interface IEmployeeRepository {
  findAll(): Promise<Employee[]>;
  findById(id: string): Promise<Employee | null>;
  create(data: CreateEmployeeData): Promise<Employee>;
  update(id: string, data: UpdateEmployeeData): Promise<Employee>;
  delete(id: string): Promise<void>;
  findByRole(role: string): Promise<Employee[]>;
  findWithDevicesCount(): Promise<(Employee & { devicesCount: number })[]>;
}

export class EmployeeRepository implements IEmployeeRepository {
  async findAll(): Promise<Employee[]> {
    const users = await prisma.users.findMany({
      orderBy: { created_at: 'desc' },
    });
    
    const roles = ['Developer', 'UX Designer', 'Secretary', 'Manager', 'DevOps', 'Product Manager', 'Data Analyst', 'QA Engineer'];
    
    return users.map((user, index) => ({
      id: user.id.toString(),
      name: `${user.first_name} ${user.last_name}`,
      role: roles[index % roles.length],
      createdAt: user.created_at || new Date(),
      updatedAt: user.updated_at || new Date(),
    }));
  }

  async findById(id: string): Promise<Employee | null> {
    const user = await prisma.users.findUnique({
      where: { id: parseInt(id) },
    });
    
    if (!user) return null;
    
    const roles = ['Developer', 'UX Designer', 'Secretary', 'Manager', 'DevOps', 'Product Manager', 'Data Analyst', 'QA Engineer'];
    
    return {
      id: user.id.toString(),
      name: `${user.first_name} ${user.last_name}`,
      role: roles[(user.id - 1) % roles.length],
      createdAt: user.created_at || new Date(),
      updatedAt: user.updated_at || new Date(),
    };
  }

  async create(data: CreateEmployeeData): Promise<Employee> {
    const [firstName, ...lastNameParts] = data.name.split(' ');
    const lastName = lastNameParts.join(' ') || '';
    
    const user = await prisma.users.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      },
    });
    
    return {
      id: user.id.toString(),
      name: `${user.first_name} ${user.last_name}`,
      role: data.role,
      createdAt: user.created_at || new Date(),
      updatedAt: user.updated_at || new Date(),
    };
  }

  async update(id: string, data: UpdateEmployeeData): Promise<Employee> {
    let updateData: any = {};
    
    if (data.name) {
      const [firstName, ...lastNameParts] = data.name.split(' ');
      updateData.first_name = firstName;
      updateData.last_name = lastNameParts.join(' ') || '';
    }
    
    const user = await prisma.users.update({
      where: { id: parseInt(id) },
      data: updateData,
    });
    
    const roles = ['Developer', 'UX Designer', 'Secretary', 'Manager', 'DevOps', 'Product Manager', 'Data Analyst', 'QA Engineer'];
    
    return {
      id: user.id.toString(),
      name: `${user.first_name} ${user.last_name}`,
      role: data.role || roles[(user.id - 1) % roles.length],
      createdAt: user.created_at || new Date(),
      updatedAt: user.updated_at || new Date(),
    };
  }

  async delete(id: string): Promise<void> {
    await prisma.users.delete({
      where: { id: parseInt(id) },
    });
  }

  async findByRole(role: string): Promise<Employee[]> {
    const users = await prisma.users.findMany({
      orderBy: { created_at: 'desc' },
    });
    
    return users
      .map((user, index) => {
        const roles = ['Developer', 'UX Designer', 'Secretary', 'Manager', 'DevOps', 'Product Manager', 'Data Analyst', 'QA Engineer'];
        return {
          id: user.id.toString(),
          name: `${user.first_name} ${user.last_name}`,
          role: roles[index % roles.length],
          createdAt: user.created_at || new Date(),
          updatedAt: user.updated_at || new Date(),
        };
      })
      .filter(employee => employee.role.toLowerCase().includes(role.toLowerCase()));
  }

  async findWithDevicesCount(): Promise<(Employee & { devicesCount: number })[]> {
    const users = await prisma.users.findMany({
      orderBy: { created_at: 'desc' },
    });
    
    // Récupérer tous les devices pour compter ceux assignés à chaque user
    const devices = await prisma.device.findMany();
    const deviceCountByUser = new Map<string, number>();
    
    devices.forEach(device => {
      if (device.employeeId) {
        const count = deviceCountByUser.get(device.employeeId) || 0;
        deviceCountByUser.set(device.employeeId, count + 1);
      }
    });

    const roles = ['Developer', 'UX Designer', 'Secretary', 'Manager', 'DevOps', 'Product Manager', 'Data Analyst', 'QA Engineer'];
    
    return users.map((user, index) => ({
      id: user.id.toString(),
      name: `${user.first_name} ${user.last_name}`,
      role: roles[index % roles.length],
      createdAt: user.created_at || new Date(),
      updatedAt: user.updated_at || new Date(),
      devicesCount: deviceCountByUser.get(user.id.toString()) || 0,
    }));
  }
}