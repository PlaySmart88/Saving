export interface FinancialData {
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsGoal: number;
  currentSavings: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface CalculationResult {
  disposableIncome: number;
  monthsToGoal: number;
  isGoalReachable: boolean;
  progressPercentage: number;
}
