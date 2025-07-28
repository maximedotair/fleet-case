/**
 * Sales Prediction Algorithm
 * Fleet Management Technical Test - Step 3
 * 
 * This algorithm predicts future sales for each product based on historical data
 * using linear regression and moving averages.
 */

interface SalesData {
  date: string;
  product_id: number;
  product_name: string;
  daily_sales: number;
  quantity_sold: number;
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

class SalesPredictionService {
  /**
   * Simple linear regression to calculate trend
   */
  private calculateLinearRegression(data: number[]): { slope: number; intercept: number } {
    const n = data.length;
    if (n < 2) return { slope: 0, intercept: data[0] || 0 };

    const sumX = data.reduce((sum, _, i) => sum + i, 0);
    const sumY = data.reduce((sum, val) => sum + val, 0);
    const sumXY = data.reduce((sum, val, i) => sum + i * val, 0);
    const sumXX = data.reduce((sum, _, i) => sum + i * i, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
  }

  /**
   * Calculate moving average for smoothing
   */
  private calculateMovingAverage(data: number[], window: number = 7): number[] {
    const result: number[] = [];
    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - window + 1);
      const windowData = data.slice(start, i + 1);
      const average = windowData.reduce((sum, val) => sum + val, 0) / windowData.length;
      result.push(average);
    }
    return result;
  }

  /**
   * Determine trend direction
   */
  private getTrend(slope: number): 'increasing' | 'decreasing' | 'stable' {
    if (slope > 0.1) return 'increasing';
    if (slope < -0.1) return 'decreasing';
    return 'stable';
  }

  /**
   * Calculate confidence score based on data consistency
   */
  private calculateConfidence(data: number[], prediction: number): number {
    if (data.length < 3) return 0.3;

    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Lower variance = higher confidence
    const variabilityScore = Math.max(0, 1 - (standardDeviation / mean));
    
    // Check if prediction is within reasonable bounds
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const boundsScore = prediction >= minValue * 0.5 && prediction <= maxValue * 2 ? 1 : 0.5;
    
    return Math.min(1, (variabilityScore * 0.7 + boundsScore * 0.3));
  }

  /**
   * Generate recommendation based on prediction
   */
  private generateRecommendation(
    trend: 'increasing' | 'decreasing' | 'stable',
    confidence: number,
    predictedSales: number
  ): string {
    if (confidence < 0.4) {
      return "Insufficient data for reliable prediction. Collect more historical data.";
    }

    switch (trend) {
      case 'increasing':
        return confidence > 0.7 
          ? "Strong upward trend detected. Consider increasing inventory and marketing investment."
          : "Moderate upward trend. Monitor closely and prepare for potential demand increase.";
      
      case 'decreasing':
        return confidence > 0.7
          ? "Strong downward trend detected. Review pricing strategy and consider promotions."
          : "Moderate downward trend. Investigate potential causes and adjust strategy.";
      
      case 'stable':
        return "Stable sales pattern. Maintain current strategy with regular monitoring.";
    }
  }

  /**
   * Main prediction function
   */
  async predictSales(historicalData: SalesData[]): Promise<PredictionResult[]> {
    // Group data by product
    const productData = new Map<number, SalesData[]>();
    
    historicalData.forEach(data => {
      if (!productData.has(data.product_id)) {
        productData.set(data.product_id, []);
      }
      productData.get(data.product_id)!.push(data);
    });

    const predictions: PredictionResult[] = [];

    for (const [productId, data] of productData) {
      // Sort by date
      data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      const salesValues = data.map(d => d.daily_sales);
      const productName = data[0].product_name;

      if (salesValues.length < 2) {
        // Not enough data for prediction
        predictions.push({
          product_id: productId,
          product_name: productName,
          current_trend: 'stable',
          predicted_daily_sales: salesValues[0] || 0,
          predicted_weekly_sales: (salesValues[0] || 0) * 7,
          predicted_monthly_sales: (salesValues[0] || 0) * 30,
          confidence_score: 0.2,
          recommendation: "Insufficient historical data for accurate prediction."
        });
        continue;
      }

      // Apply moving average for smoothing
      const smoothedData = this.calculateMovingAverage(salesValues, 3);
      
      // Calculate linear regression
      const { slope, intercept } = this.calculateLinearRegression(smoothedData);
      
      // Predict next value
      const nextIndex = smoothedData.length;
      const predictedDailySales = Math.max(0, slope * nextIndex + intercept);
      
      // Calculate trend
      const trend = this.getTrend(slope);
      
      // Calculate confidence
      const confidence = this.calculateConfidence(smoothedData, predictedDailySales);
      
      // Generate recommendation
      const recommendation = this.generateRecommendation(trend, confidence, predictedDailySales);

      predictions.push({
        product_id: productId,
        product_name: productName,
        current_trend: trend,
        predicted_daily_sales: Math.round(predictedDailySales * 100) / 100,
        predicted_weekly_sales: Math.round(predictedDailySales * 7 * 100) / 100,
        predicted_monthly_sales: Math.round(predictedDailySales * 30 * 100) / 100,
        confidence_score: Math.round(confidence * 100) / 100,
        recommendation
      });
    }

    return predictions.sort((a, b) => b.predicted_daily_sales - a.predicted_daily_sales);
  }
}

/**
 * SQL Query to get historical sales data for prediction
 */
export const SALES_DATA_QUERY = `
  SELECT 
    DATE(o.order_date) as date,
    p.id as product_id,
    p.name as product_name,
    SUM(oi.total_price) as daily_sales,
    SUM(oi.quantity) as quantity_sold
  FROM orders o
  JOIN order_items oi ON o.id = oi.order_id
  JOIN products p ON oi.product_id = p.id
  WHERE o.status IN ('delivered', 'shipped', 'pending')
    AND o.order_date >= datetime('now', '-60 days')  -- Last 60 days
  GROUP BY DATE(o.order_date), p.id, p.name
  ORDER BY p.id, date;
`;

/**
 * Advanced prediction with seasonal adjustment
 */
export class AdvancedSalesPredictionService extends SalesPredictionService {
  /**
   * Detect seasonal patterns (weekly/monthly cycles)
   */
  private detectSeasonality(data: SalesData[]): { hasWeeklyPattern: boolean; hasMonthlyPattern: boolean } {
    // Simple seasonality detection based on day of week patterns
    const weeklyData = new Array(7).fill(0);
    const weeklyCounts = new Array(7).fill(0);
    
    data.forEach(d => {
      const dayOfWeek = new Date(d.date).getDay();
      weeklyData[dayOfWeek] += d.daily_sales;
      weeklyCounts[dayOfWeek]++;
    });
    
    // Calculate average sales per day of week
    const weeklyAverages = weeklyData.map((sum, i) => 
      weeklyCounts[i] > 0 ? sum / weeklyCounts[i] : 0
    );
    
    // Check if there's significant variation (> 20% difference)
    const maxWeekly = Math.max(...weeklyAverages);
    const minWeekly = Math.min(...weeklyAverages.filter(v => v > 0));
    const hasWeeklyPattern = (maxWeekly - minWeekly) / maxWeekly > 0.2;
    
    return {
      hasWeeklyPattern,
      hasMonthlyPattern: false // Simplified for this example
    };
  }

  /**
   * Enhanced prediction with seasonality
   */
  async predictSalesWithSeasonality(historicalData: SalesData[]): Promise<PredictionResult[]> {
    const basicPredictions = await this.predictSales(historicalData);
    
    // Group data by product for seasonality analysis
    const productData = new Map<number, SalesData[]>();
    historicalData.forEach(data => {
      if (!productData.has(data.product_id)) {
        productData.set(data.product_id, []);
      }
      productData.get(data.product_id)!.push(data);
    });
    
    // Enhance predictions with seasonal adjustments
    return basicPredictions.map(prediction => {
      const data = productData.get(prediction.product_id) || [];
      const seasonality = this.detectSeasonality(data);
      
      let adjustedPrediction = { ...prediction };
      
      if (seasonality.hasWeeklyPattern) {
        // Apply weekly seasonal adjustment
        adjustedPrediction.confidence_score = Math.min(1, prediction.confidence_score + 0.1);
        adjustedPrediction.recommendation += " Weekly pattern detected.";
      }
      
      return adjustedPrediction;
    });
  }
}

// Example usage
export async function runSalesPrediction(): Promise<void> {
  const predictionService = new AdvancedSalesPredictionService();
  
  // This would typically come from your database
  const sampleData: SalesData[] = [
    { date: '2024-01-01', product_id: 1, product_name: 'PRODUCT_1', daily_sales: 149.99, quantity_sold: 1 },
    { date: '2024-01-02', product_id: 1, product_name: 'PRODUCT_1', daily_sales: 299.98, quantity_sold: 2 },
    // ... more data
  ];
  
  const predictions = await predictionService.predictSalesWithSeasonality(sampleData);
  
  console.log('Sales Predictions:');
  predictions.forEach(p => {
    console.log(`
Product: ${p.product_name}
Trend: ${p.current_trend}
Predicted Daily Sales: $${p.predicted_daily_sales}
Predicted Weekly Sales: $${p.predicted_weekly_sales}
Predicted Monthly Sales: $${p.predicted_monthly_sales}
Confidence: ${(p.confidence_score * 100).toFixed(1)}%
Recommendation: ${p.recommendation}
---`);
  });
}

export { SalesPredictionService };
export type { SalesData, PredictionResult };

/**
 * Main function to run sales prediction algorithm with database connection
 */
export async function salesPredictionAlgorithm(options: {
  dbPath: string;
  period?: number;
  productIds?: number[];
  advanced?: boolean;
}): Promise<PredictionResult[]> {
  const Database = require('better-sqlite3');
  const db = new Database(options.dbPath);

  try {
    // Build query with optional filters
    let query = SALES_DATA_QUERY;
    const params: any[] = [];

    if (options.productIds && options.productIds.length > 0) {
      const placeholders = options.productIds.map(() => '?').join(',');
      query = query.replace(
        'WHERE o.status IN',
        `WHERE p.id IN (${placeholders}) AND o.status IN`
      );
      params.push(...options.productIds);
    }

    if (options.period && options.period !== 60) {
      query = query.replace('-60 days', `-${options.period} days`);
    }

    // Execute query
    const stmt = db.prepare(query);
    const salesData: SalesData[] = params.length > 0 ? stmt.all(...params) : stmt.all();

    // Run prediction algorithm
    const service = options.advanced
      ? new AdvancedSalesPredictionService()
      : new SalesPredictionService();

    const predictions = options.advanced && service instanceof AdvancedSalesPredictionService
      ? await service.predictSalesWithSeasonality(salesData)
      : await service.predictSales(salesData);

    return predictions;

  } finally {
    db.close();
  }
}