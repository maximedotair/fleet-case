"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Target, 
  Clock, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Settings,
  Play
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  total_orders: number;
  total_quantity: number;
  total_revenue: number;
}

interface Analytics {
  total_orders: number;
  total_products: number;
  total_customers: number;
  total_revenue: number;
  avg_order_value: number;
}

interface PredictionResult {
  product_id: number;
  product_name: string;
  current_trend: 'increasing' | 'decreasing' | 'stable';
  predicted_daily_sales: number;
  predicted_weekly_sales: number;
  predicted_monthly_sales: number;
  confidence_score: number;
  recommendation: string;
}

interface PredictionResponse {
  success: boolean;
  predictions: PredictionResult[];
  executionTime: number;
  metadata: {
    period: number;
    productCount: number;
    advancedMode: boolean;
  };
  error?: string;
}

interface ProductsResponse {
  success: boolean;
  products: Product[];
  analytics: Analytics;
  error?: string;
}

export default function PredictionsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [period, setPeriod] = useState<number>(30);
  const [advancedMode, setAdvancedMode] = useState<boolean>(false);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [predicting, setPredicting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchProductsData();
  }, []);

  const fetchProductsData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/predictions");
      const data: ProductsResponse = await response.json();
      
      if (data.success) {
        setProducts(data.products);
        setAnalytics(data.analytics);
      } else {
        setError(data.error || "Error loading data");
      }
    } catch (err) {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const runPrediction = async () => {
    setPredicting(true);
    setError("");
    
    try {
      const response = await fetch("/api/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          period,
          productIds: selectedProducts.length > 0 ? selectedProducts : undefined,
          advanced: advancedMode,
        }),
      });

      const data: PredictionResponse = await response.json();
      
      if (data.success) {
        setPredictions(data.predictions);
      } else {
        setError(data.error || "Error executing predictions");
      }
    } catch (err) {
      setError("Error executing predictions");
    } finally {
      setPredicting(false);
    }
  };

  const handleProductSelection = (productId: number) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <BarChart3 className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return 'text-green-700 bg-green-50';
      case 'decreasing':
        return 'text-red-700 bg-red-50';
      default:
        return 'text-gray-700 bg-gray-50';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.7) return 'text-green-700 bg-green-50';
    if (confidence >= 0.4) return 'text-yellow-700 bg-yellow-50';
    return 'text-red-700 bg-red-50';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading data...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error && !analytics) {
    return (
      <AppLayout>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
              </div>
              <div className="mt-4">
                <Button onClick={fetchProductsData} size="sm">
                  Retry
                </Button>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Predictions</h1>
          <p className="mt-2 text-gray-600">
            Prediction algorithm based on historical trends analysis.
          </p>
        </div>

        {/* Analytics Overview */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-blue-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Orders</p>
                  <p className="text-lg font-semibold text-gray-900">{analytics.total_orders}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-green-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Products</p>
                  <p className="text-lg font-semibold text-gray-900">{analytics.total_products}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-purple-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Customers</p>
                  <p className="text-lg font-semibold text-gray-900">{analytics.total_customers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-yellow-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(analytics.total_revenue)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-red-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Avg. Order</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(analytics.avg_order_value)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Configuration */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Prediction Configuration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Period Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Analysis Period (days)
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
                <option value={90}>90 days</option>
              </select>
            </div>

            {/* Advanced Mode */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={advancedMode}
                  onChange={(e) => setAdvancedMode(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Advanced mode (seasonality)
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Includes seasonal pattern analysis
              </p>
            </div>

            {/* Run Prediction */}
            <div className="flex items-end">
              <Button
                onClick={runPrediction}
                disabled={predicting || !analytics}
                className="w-full flex items-center justify-center"
              >
                <Play className="h-4 w-4 mr-2" />
                {predicting ? 'Running...' : 'Run Prediction'}
              </Button>
            </div>
          </div>

          {/* Product Selection */}
          {products.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Product Selection ({selectedProducts.length}/{products.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                {products.map((product) => (
                  <label
                    key={product.id}
                    className="flex items-center space-x-2 p-2 rounded border hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleProductSelection(product.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(product.total_revenue)} CA
                      </p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="mt-2 flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedProducts(products.map(p => p.id))}
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedProducts([])}
                >
                  Deselect All
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Predictions Results */}
        {predictions.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Prediction Results
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {predictions.map((prediction) => (
                <div key={prediction.product_id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{prediction.product_name}</h3>
                      <div className="flex items-center mt-1">
                        {getTrendIcon(prediction.current_trend)}
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(prediction.current_trend)}`}>
                          {prediction.current_trend === 'increasing' ? 'Growing' :
                           prediction.current_trend === 'decreasing' ? 'Declining' : 'Stable'}
                        </span>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(prediction.confidence_score)}`}>
                      {Math.round(prediction.confidence_score * 100)}% confidence
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Day</p>
                      <p className="text-sm font-semibold">
                        {formatCurrency(prediction.predicted_daily_sales)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Week</p>
                      <p className="text-sm font-semibold">
                        {formatCurrency(prediction.predicted_weekly_sales)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Month</p>
                      <p className="text-sm font-semibold">
                        {formatCurrency(prediction.predicted_monthly_sales)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded p-3">
                    <p className="text-xs font-medium text-gray-700 mb-1">Recommendation:</p>
                    <p className="text-xs text-gray-600">{prediction.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}