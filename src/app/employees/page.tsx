"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Employee } from "@/domain/entities/Employee";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<(Employee & { devicesCount: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchRole, setSearchRole] = useState("");
  const [sortBy, setSortBy] = useState<'name' | 'role' | 'equipment' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const fetchEmployees = async () => {
    try {
      const params = new URLSearchParams();
      if (searchRole) {
        params.append("role", searchRole);
      }
      
      const response = await fetch(`/api/employees?${params}`);
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [searchRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/employees/${editingId}` : "/api/employees";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: "", role: "" });
        setEditingId(null);
        fetchEmployees();
      }
    } catch (error) {
      console.error("Failed to save employee:", error);
    }
  };

  const handleEdit = (employee: Employee) => {
    setFormData({
      name: employee.name,
      role: employee.role,
    });
    setEditingId(employee.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchEmployees();
      }
    } catch (error) {
      console.error("Failed to delete employee:", error);
    }
  };

  const cancelEdit = () => {
    setFormData({ name: "", role: "" });
    setEditingId(null);
  };

  const handleSort = (column: 'name' | 'role' | 'equipment') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    if (!sortBy) return 0;

    let aValue: string | number;
    let bValue: string | number;

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'role':
        aValue = a.role.toLowerCase();
        bValue = b.role.toLowerCase();
        break;
      case 'equipment':
        aValue = a.devicesCount;
        bValue = b.devicesCount;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
          <p className="mt-2 text-gray-600">
            Manage your employees and view their assigned equipment.
          </p>
        </div>

        {/* Search */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by role..."
                value={searchRole}
                onChange={(e) => setSearchRole(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setSearchRole("")}
            >
              Clear
            </Button>
          </div>
        </div>

        {/* Add/Edit Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingId ? "Edit Employee" : "Add Employee"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Employee name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              placeholder="Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
            />
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                {editingId ? "Update" : "Add"}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Employees Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Employee List</h3>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Name</span>
                        {sortBy === 'name' && (
                          <span className="text-blue-600">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('role')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Role</span>
                        {sortBy === 'role' && (
                          <span className="text-blue-600">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('equipment')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Equipment</span>
                        {sortBy === 'equipment' && (
                          <span className="text-blue-600">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {employee.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.devicesCount} device(s)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(employee)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(employee.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {sortedEmployees.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                        No employees found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}