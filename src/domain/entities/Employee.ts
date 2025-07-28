export interface Employee {
  id: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEmployeeData {
  name: string;
  role: string;
}

export interface UpdateEmployeeData {
  name?: string;
  role?: string;
}