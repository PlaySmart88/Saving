import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { FinancialData, CalculationResult, ChartDataPoint } from '../types';
import { TrendingUp, AlertCircle, CheckCircle, Calendar } from 'lucide-react';

interface ResultsPanelProps {
  data: FinancialData;
  results: CalculationResult;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ data, results }) => {
  const chartData: ChartDataPoint[] = [
    { name: 'Expenses', value: data.monthlyExpenses, color: '#f87171' }, // red-400
    { name: 'Savings', value: Math.max(0, results.disposableIncome), color: '#34d399' }, // emerald-400
  ];

  // If both are 0, show a placeholder to avoid empty chart error or invisible chart
  if (data.monthlyExpenses === 0 && results.disposableIncome <= 0) {
    chartData[0].value = 1; // Dummy value
    chartData[0].color = '#ffffff20'; // Transparent white
    chartData[0].name = 'No Data';
    chartData.pop(); // Remove savings
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      
      {/* Summary Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Monthly Savings</p>
          <p className={`text-xl font-bold ${results.disposableIncome > 0 ? 'text-emerald-300' : 'text-red-300'}`}>
            {formatCurrency(results.disposableIncome)}
          </p>
        </div>
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
           <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Months to Goal</p>
           <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-300" />
            <p className="text-xl font-bold text-white">
              {results.isGoalReachable 
                ? (results.monthsToGoal === 0 ? "Goal Reached!" : results.monthsToGoal)
                : "∞"}
            </p>
           </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="flex-grow min-h-[250px] relative bg-white/5 rounded-2xl p-2 border border-white/10 flex items-center justify-center flex-col">
        {!results.isGoalReachable && data.monthlyExpenses > data.monthlyIncome ? (
            <div className="text-center p-6 animate-pulse">
                <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-red-200">Expenses Exceed Income</h3>
                <p className="text-white/60 text-sm mt-2">Adjust your budget to start saving.</p>
            </div>
        ) : (
            <>
                <h3 className="text-white/80 text-sm font-medium absolute top-4 left-4">Breakdown</h3>
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                    >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
                        itemStyle={{ color: 'white' }}
                        formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: 'rgba(255,255,255,0.8)' }}/>
                </PieChart>
                </ResponsiveContainer>
            </>
        )}
      </div>

      {/* Progress Section */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-white/80">
          <span>Goal Progress</span>
          <span className="font-bold">{Math.min(100, Math.round(results.progressPercentage))}%</span>
        </div>
        <div className="h-4 w-full bg-black/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-blue-400 to-pink-400 transition-all duration-1000 ease-out relative"
            style={{ width: `${Math.min(100, results.progressPercentage)}%` }}
          >
            {/* Shimmer effect on bar */}
            <div className="absolute top-0 left-0 bottom-0 right-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>
        <div className="flex justify-between text-xs text-white/50 pt-1">
          <span>{formatCurrency(data.currentSavings)}</span>
          <span>{formatCurrency(data.savingsGoal)}</span>
        </div>
      </div>

      {results.isGoalReachable && results.monthsToGoal < 3 && results.monthsToGoal > 0 && (
         <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-3 flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-emerald-300 mt-0.5 shrink-0" />
            <div>
                <p className="text-sm font-semibold text-emerald-100">Almost there!</p>
                <p className="text-xs text-emerald-200/80">You could reach your goal in less than 3 months.</p>
            </div>
         </div>
      )}

      {results.isGoalReachable && results.monthsToGoal === 0 && data.savingsGoal > 0 && (
          <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-3 flex items-start gap-3 animate-bounce">
          <CheckCircle className="w-5 h-5 text-purple-300 mt-0.5 shrink-0" />
          <div>
              <p className="text-sm font-semibold text-purple-100">Goal Achieved!</p>
              <p className="text-xs text-purple-200/80">You have enough savings to meet your goal.</p>
          </div>
       </div>
      )}

    </div>
  );
};