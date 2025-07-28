import { NextRequest, NextResponse } from "next/server";
import { EmployeeService } from "@/services/employee.service";
import { CreateEmployeeSchema } from "@/dtos/employee.dto";
import { ZodError } from "zod";

const employeeService = new EmployeeService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");

    let employees;
    if (role) {
      employees = await employeeService.searchEmployeesByRole(role);
    } else {
      employees = await employeeService.getEmployeesWithDevicesCount();
    }

    return NextResponse.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = CreateEmployeeSchema.parse(body);
    
    const employee = await employeeService.createEmployee(validatedData);
    
    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error("Error creating employee:", error);
    
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
      { error: "Failed to create employee" },
      { status: 500 }
    );
  }
}