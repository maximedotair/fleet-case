import { DeviceRepository, IDeviceRepository } from "@/repositories/device.repository";
import { Device, DeviceWithEmployee, CreateDeviceData, UpdateDeviceData } from "@/domain/entities/Device";
import { EmployeeRepository } from "@/repositories/employee.repository";

export interface IDeviceService {
  getAllDevices(): Promise<DeviceWithEmployee[]>;
  getDeviceById(id: string): Promise<DeviceWithEmployee | null>;
  createDevice(data: CreateDeviceData): Promise<Device>;
  updateDevice(id: string, data: UpdateDeviceData): Promise<Device>;
  deleteDevice(id: string): Promise<void>;
  searchDevicesByType(type: string): Promise<DeviceWithEmployee[]>;
  getDevicesByUser(userId: string): Promise<Device[]>;
  getUnassignedDevices(): Promise<DeviceWithEmployee[]>;
  assignDeviceToUser(deviceId: string, userId: string): Promise<Device>;
  unassignDevice(deviceId: string): Promise<Device>;
}

export class DeviceService implements IDeviceService {
  private deviceRepository: IDeviceRepository;
  private employeeRepository: EmployeeRepository;

  constructor(deviceRepository?: IDeviceRepository, employeeRepository?: EmployeeRepository) {
    this.deviceRepository = deviceRepository || new DeviceRepository();
    this.employeeRepository = employeeRepository || new EmployeeRepository();
  }

  async getAllDevices(): Promise<DeviceWithEmployee[]> {
    return await this.deviceRepository.findAll();
  }

  async getDeviceById(id: string): Promise<DeviceWithEmployee | null> {
    if (!id) {
      throw new Error("Device ID is required");
    }
    return await this.deviceRepository.findById(id);
  }

  async createDevice(data: CreateDeviceData): Promise<Device> {
    if (!data.name?.trim()) {
      throw new Error("Device name is required");
    }
    if (!data.type?.trim()) {
      throw new Error("Device type is required");
    }

    // Validate user exists if provided
    if (data.employeeId) {
      const user = await this.employeeRepository.findById(data.employeeId);
      if (!user) {
        throw new Error("User not found");
      }
    }

    return await this.deviceRepository.create({
      name: data.name.trim(),
      type: data.type.trim(),
      employeeId: data.employeeId,
    });
  }

  async updateDevice(id: string, data: UpdateDeviceData): Promise<Device> {
    if (!id) {
      throw new Error("Device ID is required");
    }

    const existingDevice = await this.deviceRepository.findById(id);
    if (!existingDevice) {
      throw new Error("Device not found");
    }

    const updateData: UpdateDeviceData = {};
    
    if (data.name !== undefined) {
      if (!data.name.trim()) {
        throw new Error("Device name cannot be empty");
      }
      updateData.name = data.name.trim();
    }
    
    if (data.type !== undefined) {
      if (!data.type.trim()) {
        throw new Error("Device type cannot be empty");
      }
      updateData.type = data.type.trim();
    }
    
    if (data.employeeId !== undefined) {
      if (data.employeeId) {
        const user = await this.employeeRepository.findById(data.employeeId);
        if (!user) {
          throw new Error("User not found");
        }
      }
      updateData.employeeId = data.employeeId;
    }

    return await this.deviceRepository.update(id, updateData);
  }

  async deleteDevice(id: string): Promise<void> {
    if (!id) {
      throw new Error("Device ID is required");
    }

    const existingDevice = await this.deviceRepository.findById(id);
    if (!existingDevice) {
      throw new Error("Device not found");
    }

    await this.deviceRepository.delete(id);
  }

  async searchDevicesByType(type: string): Promise<DeviceWithEmployee[]> {
    if (!type?.trim()) {
      return await this.getAllDevices();
    }
    return await this.deviceRepository.findByType(type.trim());
  }

  async getDevicesByUser(userId: string): Promise<Device[]> {
    if (!userId) {
      throw new Error("User ID is required");
    }
    return await this.deviceRepository.findByUserId(userId);
  }

  async getUnassignedDevices(): Promise<DeviceWithEmployee[]> {
    return await this.deviceRepository.findUnassigned();
  }

  async assignDeviceToUser(deviceId: string, userId: string): Promise<Device> {
    if (!deviceId) {
      throw new Error("Device ID is required");
    }
    if (!userId) {
      throw new Error("User ID is required");
    }

    const device = await this.deviceRepository.findById(deviceId);
    if (!device) {
      throw new Error("Device not found");
    }

    const user = await this.employeeRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    return await this.deviceRepository.update(deviceId, { employeeId: userId });
  }

  async unassignDevice(deviceId: string): Promise<Device> {
    if (!deviceId) {
      throw new Error("Device ID is required");
    }

    const device = await this.deviceRepository.findById(deviceId);
    if (!device) {
      throw new Error("Device not found");
    }

    return await this.deviceRepository.update(deviceId, { employeeId: null });
  }
}