"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Plus, Edit, Trash2 } from "lucide-react";
import { DeviceWithEmployee } from "@/domain/entities/Device";
import { Employee } from "@/domain/entities/Employee";
import { DEVICE_TYPES } from "@/domain/entities/Device";

export default function DevicesPage() {
  const [devices, setDevices] = useState<DeviceWithEmployee[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    employeeId: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchType, setSearchType] = useState("");
  const [filterOwner, setFilterOwner] = useState("");

  const fetchDevices = async () => {
    try {
      const params = new URLSearchParams();
      if (searchType) {
        params.append("type", searchType);
      }
      
      const response = await fetch(`/api/devices?${params}`);
      const data = await response.json();
      setDevices(data);
    } catch (error) {
      console.error("Failed to fetch devices:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/employees");
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  useEffect(() => {
    fetchDevices();
    fetchEmployees();
  }, [searchType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/devices/${editingId}` : "/api/devices";
      
      const payload = {
        ...formData,
        employeeId: formData.employeeId || undefined,
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setFormData({ name: "", type: "", employeeId: "" });
        setEditingId(null);
        fetchDevices();
      }
    } catch (error) {
      console.error("Failed to save device:", error);
    }
  };

  const handleEdit = (device: DeviceWithEmployee) => {
    setFormData({
      name: device.name,
      type: device.type,
      employeeId: device.employeeId || "",
    });
    setEditingId(device.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this device?")) {
      return;
    }

    try {
      const response = await fetch(`/api/devices/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchDevices();
      }
    } catch (error) {
      console.error("Failed to delete device:", error);
    }
  };

  const cancelEdit = () => {
    setFormData({ name: "", type: "", employeeId: "" });
    setEditingId(null);
  };

  // Filter devices by owner
  const filteredDevices = devices.filter(device => {
    if (!filterOwner) return true;
    if (filterOwner === "unassigned") return !device.employee;
    return device.employee?.name.toLowerCase().includes(filterOwner.toLowerCase());
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Device Management</h1>
          <p className="mt-2 text-gray-600">
            Manage your devices and their assignments to employees.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search by type
              </label>
              <Select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="">All types</option>
                {DEVICE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by owner
              </label>
              <Input
                placeholder="Employee name..."
                value={filterOwner}
                onChange={(e) => setFilterOwner(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchType("");
                  setFilterOwner("");
                }}
                className="w-full"
              >
                Clear filters
              </Button>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingId ? "Edit Device" : "Add Device"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Device name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            >
              <option value="">Select a type</option>
              {DEVICE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
            <Select
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
            >
              <option value="">Unassigned</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </Select>
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

        {/* Devices Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Device List</h3>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDevices.map((device) => (
                    <tr key={device.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {device.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {device.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {device.employee ? (
                          <div>
                            <div className="font-medium">{device.employee.name}</div>
                            <div className="text-gray-400">{device.employee.role}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(device)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(device.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredDevices.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                        No devices found
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