import React, { useState, useEffect, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import { FinancialData, CalculationResult } from './types';
import { GlassCard } from './components/GlassCard';
import { InputGroup } from './components/InputGroup';
import { ResultsPanel } from './components/ResultsPanel';

const App: React.FC = () => {
  // State for inputs
  const [data, setData] = useState<FinancialData>({
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savingsGoal: 0,
    currentSavings: 0,
  });

  // Calculate results dynamically
  const results: CalculationResult = useMemo(() => {
    const disposableIncome = data.monthlyIncome - data.monthlyExpenses;
    const remainingGoal = Math.max(0, data.savingsGoal - data.currentSavings);
    
    let monthsToGoal = 0;
    let isGoalReachable = true;

    if (remainingGoal <= 0) {
      monthsToGoal = 0;
    } else if (disposableIncome <= 0) {
      isGoalReachable = false;
      monthsToGoal = Infinity;
    } else {
      monthsToGoal = Math.ceil(remainingGoal / disposableIncome);
    }

    const progressPercentage = data.savingsGoal > 0 
      ? (data.currentSavings / data.savingsGoal) * 100 
      : 0;

    return {
      disposableIncome,
      monthsToGoal,
      isGoalReachable,
      progressPercentage,
    };
  }, [data]);

  // Confetti Logic
  const hasCelebratedRef = useRef(false);

  useEffect(() => {
    // Reset celebration flag if conditions are no longer met
    if (results.monthsToGoal >= 3 || !results.isGoalReachable || data.savingsGoal === 0) {
      hasCelebratedRef.current = false;
    }

    // Trigger confetti if goal is close (less than 3 months) or reached
    const isClose = results.isGoalReachable && results.monthsToGoal < 3 && results.monthsToGoal > 0;
    const isReached = results.isGoalReachable && results.monthsToGoal === 0 && data.savingsGoal > 0;

    if ((isClose || isReached) && !hasCelebratedRef.current) {
      hasCelebratedRef.current = true;
      
      const duration = 1500;
      const end = Date.now() + duration;

      const frame = () => {
        // launch a few confetti from the left edge
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#6366f1', '#ec4899', '#34d399']
        });
        // and launch a few from the right edge
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#6366f1', '#ec4899', '#34d399']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [results.monthsToGoal, results.isGoalReachable, data.savingsGoal]);


  // Input handlers
  const updateField = (field: keyof FinancialData, value: number) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 md:p-8 lg:p-12 flex items-center justify-center relative overflow-hidden">
      
      {/* Background decoration bubbles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-blue-500/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-pink-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-[40%] left-[50%] w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        
        {/* Left Column: Inputs */}
        <div className="flex flex-col justify-center">
          <div className="text-center lg:text-left mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-pink-200 to-white mb-2 drop-shadow-sm">
              Visualize Your Future
            </h1>
            <p className="text-indigo-200 text-lg font-light">
              Track your savings goals with crystal clear clarity.
            </p>
          </div>

          <GlassCard title="Financial Inputs" className="shadow-indigo-500/20">
            <InputGroup 
              id="income"
              label="Monthly Income"
              value={data.monthlyIncome}
              onChange={(v) => updateField('monthlyIncome', v)}
            />
            <InputGroup 
              id="expenses"
              label="Monthly Expenses"
              value={data.monthlyExpenses}
              onChange={(v) => updateField('monthlyExpenses', v)}
            />
            <div className="border-t border-white/10 my-4 pt-4">
              <InputGroup 
                id="goal"
                label="Savings Goal Total"
                value={data.savingsGoal}
                onChange={(v) => updateField('savingsGoal', v)}
              />
              <InputGroup 
                id="current"
                label="Current Savings"
                value={data.currentSavings}
                onChange={(v) => updateField('currentSavings', v)}
              />
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Visualization */}
        <div className="flex flex-col h-full">
            <GlassCard className="h-full min-h-[500px] flex flex-col shadow-pink-500/20">
                <div className="mb-6 flex items-center justify-between">
                     <h2 className="text-2xl font-bold text-white/90">Projections</h2>
                     <div className="text-xs font-mono bg-white/10 px-2 py-1 rounded text-white/60">LIVE UPDATE</div>
                </div>
                <div className="flex-grow">
                     <ResultsPanel data={data} results={results} />
                </div>
            </GlassCard>
        </div>

      </div>
    </div>
  );
};

export default App;