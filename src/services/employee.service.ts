import { EmployeeRepository, IEmployeeRepository } from "@/repositories/employee.repository";
import { Employee, CreateEmployeeData, UpdateEmployeeData } from "@/domain/entities/Employee";

export interface IEmployeeService {
  getAllEmployees(): Promise<Employee[]>;
  getEmployeeById(id: string): Promise<Employee | null>;
  createEmployee(data: CreateEmployeeData): Promise<Employee>;
  updateEmployee(id: string, data: UpdateEmployeeData): Promise<Employee>;
  deleteEmployee(id: string): Promise<void>;
  searchEmployeesByRole(role: string): Promise<Employee[]>;
  getEmployeesWithDevicesCount(): Promise<(Employee & { devicesCount: number })[]>;
}

export class EmployeeService implements IEmployeeService {
  private employeeRepository: IEmployeeRepository;

  constructor(employeeRepository?: IEmployeeRepository) {
    this.employeeRepository = employeeRepository || new EmployeeRepository();
  }

  async getAllEmployees(): Promise<Employee[]> {
    return await this.employeeRepository.findAll();
  }

  async getEmployeeById(id: string): Promise<Employee | null> {
    if (!id) {
      throw new Error("Employee ID is required");
    }
    return await this.employeeRepository.findById(id);
  }

  async createEmployee(data: CreateEmployeeData): Promise<Employee> {
    if (!data.name?.trim()) {
      throw new Error("Employee name is required");
    }
    if (!data.role?.trim()) {
      throw new Error("Employee role is required");
    }

    return await this.employeeRepository.create({
      name: data.name.trim(),
      role: data.role.trim(),
    });
  }

  async updateEmployee(id: string, data: UpdateEmployeeData): Promise<Employee> {
    if (!id) {
      throw new Error("Employee ID is required");
    }

    const existingEmployee = await this.employeeRepository.findById(id);
    if (!existingEmployee) {
      throw new Error("Employee not found");
    }

    const updateData: UpdateEmployeeData = {};
    if (data.name !== undefined) {
      if (!data.name.trim()) {
        throw new Error("Employee name cannot be empty");
      }
      updateData.name = data.name.trim();
    }
    if (data.role !== undefined) {
      if (!data.role.trim()) {
        throw new Error("Employee role cannot be empty");
      }
      updateData.role = data.role.trim();
    }

    return await this.employeeRepository.update(id, updateData);
  }

  async deleteEmployee(id: string): Promise<void> {
    if (!id) {
      throw new Error("Employee ID is required");
    }

    const existingEmployee = await this.employeeRepository.findById(id);
    if (!existingEmployee) {
      throw new Error("Employee not found");
    }

    await this.employeeRepository.delete(id);
  }

  async searchEmployeesByRole(role: string): Promise<Employee[]> {
    if (!role?.trim()) {
      return await this.getAllEmployees();
    }
    return await this.employeeRepository.findByRole(role.trim());
  }

  async getEmployeesWithDevicesCount(): Promise<(Employee & { devicesCount: number })[]> {
    return await this.employeeRepository.findWithDevicesCount();
  }
}