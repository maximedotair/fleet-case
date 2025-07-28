"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Database, Play, Trash2, RefreshCw, Check, X } from "lucide-react";

interface DatabaseStatus {
  database_exists: boolean;
  tables: Record<string, { exists: boolean; count: number }>;
  total_records: number;
  error?: string;
}

interface QueryTemplate {
  id: string;
  name: string;
  sql: string;
}

interface QueryResult {
  success: boolean;
  results: any[];
  executionTime: number;
  rowCount: number;
  error?: string;
  details?: string;
}

export default function EcommercePage() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null);
  const [queries, setQueries] = useState<QueryTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<string>("");
  const [customSql, setCustomSql] = useState<string>("");
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [executing, setExecuting] = useState(false);

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/ecommerce/status");
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error("Failed to fetch database status:", error);
    }
  };

  const fetchQueries = async () => {
    try {
      const response = await fetch("/api/ecommerce/query");
      const data = await response.json();
      setQueries(data.queries || []);
    } catch (error) {
      console.error("Failed to fetch queries:", error);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchQueries();
  }, []);

  const initializeDatabase = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/ecommerce/init", {
        method: "POST",
      });
      const result = await response.json();
      
      if (result.success) {
        await fetchStatus();
        alert(`Database initialized successfully! ${result.tablesCreated} tables created, ${result.recordsInserted} records inserted.`);
      } else {
        alert(`Failed to initialize database: ${result.error}`);
      }
    } catch (error) {
      alert("Failed to initialize database");
    } finally {
      setLoading(false);
    }
  };

  const deleteDatabase = async () => {
    if (!confirm("Are you sure you want to delete the e-commerce database? This action cannot be undone.")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/ecommerce/init", {
        method: "DELETE",
      });
      const result = await response.json();
      
      if (result.success) {
        await fetchStatus();
        setQueryResult(null);
        alert("Database deleted successfully!");
      } else {
        alert(`Failed to delete database: ${result.error}`);
      }
    } catch (error) {
      alert("Failed to delete database");
    } finally {
      setLoading(false);
    }
  };

  const executeQuery = async (sql: string) => {
    if (!sql.trim()) {
      alert("Please enter a SQL query");
      return;
    }

    setExecuting(true);
    setQueryResult(null);
    
    try {
      const response = await fetch("/api/ecommerce/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sql }),
      });
      
      const result = await response.json();
      setQueryResult(result);
    } catch (error) {
      setQueryResult({
        success: false,
        results: [],
        executionTime: 0,
        rowCount: 0,
        error: "Network error"
      });
    } finally {
      setExecuting(false);
    }
  };

  const handleQuerySelect = (queryId: string) => {
    const query = queries.find(q => q.id === queryId);
    if (query) {
      setSelectedQuery(queryId);
      setCustomSql(query.sql);
    }
  };

  const renderTable = (data: any[]) => {
    if (!data || data.length === 0) return <p className="text-gray-500">No results</p>;

    const columns = Object.keys(data[0]);

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row[column] !== null ? String(row[column]) : "NULL"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">E-commerce Database</h1>
          <p className="mt-2 text-gray-600">
            Manage the e-commerce database and execute SQL queries from the test.
          </p>
        </div>

        {/* Database Status */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Database Status
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchStatus}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {status ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                {status.database_exists ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <X className="h-5 w-5 text-red-500" />
                )}
                <span className={`font-medium ${status.database_exists ? 'text-green-700' : 'text-red-700'}`}>
                  {status.database_exists ? 'Database found' : 'Database not found'}
                </span>
              </div>

              {status.database_exists && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(status.tables).map(([table, info]) => (
                    <div key={table} className="bg-gray-50 p-3 rounded">
                      <div className="font-medium text-sm">{table}</div>
                      <div className="text-xs text-gray-600">{info.count} records</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex space-x-4">
                <Button
                  onClick={initializeDatabase}
                  disabled={loading}
                  className="flex items-center"
                >
                  <Database className="h-4 w-4 mr-2" />
                  {status.database_exists ? 'Reset' : 'Initialize'} Database
                </Button>
                
                {status.database_exists && (
                  <Button
                    variant="destructive"
                    onClick={deleteDatabase}
                    disabled={loading}
                    className="flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Database
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">Loading status...</div>
          )}
        </div>

        {/* Query Execution */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">SQL Query Execution</h2>
          
          {/* Predefined Queries */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Predefined Queries
            </label>
            <select
              value={selectedQuery}
              onChange={(e) => handleQuerySelect(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a query...</option>
              {queries.map((query) => (
                <option key={query.id} value={query.id}>
                  {query.name}
                </option>
              ))}
            </select>
          </div>

          {/* SQL Editor */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SQL Query
            </label>
            <textarea
              value={customSql}
              onChange={(e) => setCustomSql(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="Enter your SQL query here..."
            />
          </div>

          <Button
            onClick={() => executeQuery(customSql)}
            disabled={executing || !status?.database_exists}
            className="flex items-center"
          >
            <Play className="h-4 w-4 mr-2" />
            {executing ? 'Executing...' : 'Execute Query'}
          </Button>
        </div>

        {/* Query Results */}
        {queryResult && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Results</h2>
              {queryResult.success && (
                <div className="text-sm text-gray-600">
                  {queryResult.rowCount} row(s) • {queryResult.executionTime}ms
                </div>
              )}
            </div>

            {queryResult.success ? (
              <div className="space-y-4">
                {renderTable(queryResult.results)}
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <X className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Execution Error
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      {queryResult.error}
                      {queryResult.details && (
                        <div className="mt-1 font-mono text-xs">
                          {queryResult.details}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}