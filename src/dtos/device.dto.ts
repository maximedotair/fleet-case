import { z } from "zod";
import { DEVICE_TYPES } from "@/domain/entities/Device";

// Schema for creating a new device
export const CreateDeviceSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  type: z.enum(DEVICE_TYPES as [string, ...string[]], "Invalid device type"),
  employeeId: z.string().optional(),
});

// Schema for updating a device
export const UpdateDeviceSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long").optional(),
  type: z.enum(DEVICE_TYPES as [string, ...string[]], "Invalid device type").optional(),
  employeeId: z.string().nullable().optional(),
});

// Schema for device response
export const DeviceResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  employeeId: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Schema for device with employee details
export const DeviceWithEmployeeSchema = DeviceResponseSchema.extend({
  employee: z.object({
    id: z.string(),
    name: z.string(),
    role: z.string(),
  }).nullable(),
});

// Inferred types from schemas
export type CreateDeviceDto = z.infer<typeof CreateDeviceSchema>;
export type UpdateDeviceDto = z.infer<typeof UpdateDeviceSchema>;
export type DeviceResponseDto = z.infer<typeof DeviceResponseSchema>;
export type DeviceWithEmployeeDto = z.infer<typeof DeviceWithEmployeeSchema>;