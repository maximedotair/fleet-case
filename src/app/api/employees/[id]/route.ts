import { NextRequest, NextResponse } from "next/server";
import { EmployeeService } from "@/services/employee.service";
import { UpdateEmployeeSchema } from "@/dtos/employee.dto";
import { ZodError } from "zod";

const employeeService = new EmployeeService();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const employee = await employeeService.getEmployeeById(params.id);
    
    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(employee);
  } catch (error) {
    console.error("Error fetching employee:", error);
    return NextResponse.json(
      { error: "Failed to fetch employee" },
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
    const validatedData = UpdateEmployeeSchema.parse(body);
    
    const employee = await employeeService.updateEmployee(params.id, validatedData);
    
    return NextResponse.json(employee);
  } catch (error) {
    console.error("Error updating employee:", error);
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    
    if (error instanceof Error) {
      if (error.message === "Employee not found") {
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
      { error: "Failed to update employee" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await employeeService.deleteEmployee(params.id);
    
    return NextResponse.json(
      { message: "Employee deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting employee:", error);
    
    if (error instanceof Error) {
      if (error.message === "Employee not found") {
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
      { error: "Failed to delete employee" },
      { status: 500 }
    );
  }
}