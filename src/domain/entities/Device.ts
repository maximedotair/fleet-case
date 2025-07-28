export interface Device {
  id: string;
  name: string;
  type: string;
  employeeId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeviceWithEmployee extends Device {
  employee: {
    id: string;
    name: string;
    role: string;
  } | null;
}

export interface CreateDeviceData {
  name: string;
  type: string;
  employeeId?: string;
}

export interface UpdateDeviceData {
  name?: string;
  type?: string;
  employeeId?: string | null;
}

export type DeviceType = 'Laptop' | 'Desktop' | 'Phone' | 'Tablet' | 'Monitor' | 'Peripheral' | 'Other';

export const DEVICE_TYPES: DeviceType[] = [
  'Laptop',
  'Desktop', 
  'Phone',
  'Tablet',
  'Monitor',
  'Peripheral',
  'Other'
];