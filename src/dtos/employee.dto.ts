import { z } from "zod";

// Schema for creating a new employee
export const CreateEmployeeSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  role: z.string().min(1, "Role is required").max(50, "Role is too long"),
});

// Schema for updating an employee
export const UpdateEmployeeSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long").optional(),
  role: z.string().min(1, "Role is required").max(50, "Role is too long").optional(),
});

// Schema for employee response
export const EmployeeResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Inferred types from schemas
export type CreateEmployeeDto = z.infer<typeof CreateEmployeeSchema>;
export type UpdateEmployeeDto = z.infer<typeof UpdateEmployeeSchema>;
export type EmployeeResponseDto = z.infer<typeof EmployeeResponseSchema>;

// Response with devices count
export const EmployeeWithDevicesCountSchema = EmployeeResponseSchema.extend({
  devicesCount: z.number(),
});

export type EmployeeWithDevicesCountDto = z.infer<typeof EmployeeWithDevicesCountSchema>;