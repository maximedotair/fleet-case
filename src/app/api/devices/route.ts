import { NextRequest, NextResponse } from "next/server";
import { DeviceService } from "@/services/device.service";
import { CreateDeviceSchema } from "@/dtos/device.dto";
import { ZodError } from "zod";

const deviceService = new DeviceService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const employeeId = searchParams.get("employeeId");
    const unassigned = searchParams.get("unassigned");

    let devices;
    if (unassigned === "true") {
      devices = await deviceService.getUnassignedDevices();
    } else if (employeeId) {
      devices = await deviceService.getDevicesByUser(employeeId);
    } else if (type) {
      devices = await deviceService.searchDevicesByType(type);
    } else {
      devices = await deviceService.getAllDevices();
    }

    return NextResponse.json(devices);
  } catch (error) {
    console.error("Error fetching devices:", error);
    return NextResponse.json(
      { error: "Failed to fetch devices" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = CreateDeviceSchema.parse(body);
    
    const device = await deviceService.createDevice(validatedData);
    
    return NextResponse.json(device, { status: 201 });
  } catch (error) {
    console.error("Error creating device:", error);
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create device" },
      { status: 500 }
    );
  }
}