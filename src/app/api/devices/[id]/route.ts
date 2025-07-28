import { NextRequest, NextResponse } from "next/server";
import { DeviceService } from "@/services/device.service";
import { UpdateDeviceSchema } from "@/dtos/device.dto";
import { ZodError } from "zod";

const deviceService = new DeviceService();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const device = await deviceService.getDeviceById(params.id);
    
    if (!device) {
      return NextResponse.json(
        { error: "Device not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(device);
  } catch (error) {
    console.error("Error fetching device:", error);
    return NextResponse.json(
      { error: "Failed to fetch device" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = UpdateDeviceSchema.parse(body);
    
    const device = await deviceService.updateDevice(params.id, validatedData);
    
    return NextResponse.json(device);
  } catch (error) {
    console.error("Error updating device:", error);
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    
    if (error instanceof Error) {
      if (error.message === "Device not found" || error.message === "Employee not found") {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update device" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deviceService.deleteDevice(params.id);
    
    return NextResponse.json(
      { message: "Device deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting device:", error);
    
    if (error instanceof Error) {
      if (error.message === "Device not found") {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to delete device" },
      { status: 500 }
    );
  }
}