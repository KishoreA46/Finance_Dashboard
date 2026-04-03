import React, { useMemo } from 'react';
import { TrendingUp, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';
import useFinanceStore from '../../store/useFinanceStore';
import { cn } from '../../lib/utils';
import { subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

const InsightCard = ({ title, description, icon: Icon, type }) => {
  const styles = {
    positive: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-900/30",
    warning: "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-900/30",
    neutral: "bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:border-indigo-900/30",
  };

  return (
    <div className={cn("rounded-2xl border p-5 flex flex-col gap-3 transition-all hover:shadow-lg", styles[type])}>
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-white/50 dark:bg-black/20 p-2.5">
          <Icon className="h-5 w-5" />
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest opacity-70">Analysis</div>
      </div>
      <div>
        <h4 className="font-black tracking-tight text-foreground">{title}</h4>
        <p className="text-xs mt-1 text-muted-foreground leading-relaxed font-medium">{description}</p>
      </div>
    </div>
  );
};

const InsightCards = () => {
  const { transactions } = useFinanceStore();

  const metrics = useMemo(() => {
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const currentTrans = transactions.filter(t => isWithinInterval(new Date(t.date), { start: currentMonthStart, end: currentMonthEnd }));
    const lastMonthTrans = transactions.filter(t => isWithinInterval(new Date(t.date), { start: lastMonthStart, end: lastMonthEnd }));

    const currentExpenses = currentTrans.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const lastExpenses = lastMonthTrans.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const currentIncome = currentTrans.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);

    const expenseChange = lastExpenses > 0 ? ((currentExpenses - lastExpenses) / lastExpenses) * 100 : 0;
    const savingsRate = currentIncome > 0 ? ((currentIncome - currentExpenses) / currentIncome) * 100 : 0;

    let score = 50; 
    if (savingsRate > 20) score += 20;
    else if (savingsRate > 0) score += 10;
    
    if (expenseChange < 0) score += 15;
    else if (expenseChange > 20) score -= 10;

    if (currentIncome > currentExpenses) score += 15;
    
    return {
      expenseChange: expenseChange.toFixed(1),
      savingsRate: savingsRate.toFixed(1),
      isSaving: currentIncome > currentExpenses,
      score: Math.min(Math.max(score, 0), 100)
    };
  }, [transactions]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div className="lg:col-span-1 rounded-2xl border bg-card p-6 shadow-sm flex flex-col items-center justify-center text-center group hover:shadow-xl transition-all border-primary/20">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Financial Health</p>
        <div className="relative h-24 w-24 mb-4">
          <svg className="h-full w-full" viewBox="0 0 36 36">
            <path
              className="stroke-muted fill-none text-secondary"
              strokeWidth="3.8"
              strokeDasharray="100, 100"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={cn(
                "fill-none transition-all duration-1000 ease-out",
                metrics.score > 70 ? "stroke-emerald-500" : metrics.score > 40 ? "stroke-amber-500" : "stroke-rose-500"
              )}
              strokeWidth="3.8"
              strokeDasharray={`${metrics.score}, 100`}
              strokeLinecap="round"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black">{metrics.score}</span>
            <span className="text-[8px] font-bold uppercase text-muted-foreground">Points</span>
          </div>
        </div>
        <p className="text-sm font-bold capitalize">
          {metrics.score > 70 ? 'Excellent' : metrics.score > 40 ? 'Good Standing' : 'Needs Attention'}
        </p>
      </div>

      <InsightCard 
        title="Spending Trend"
        description={metrics.expenseChange < 0 
          ? `Great job! Your spending is down ${Math.abs(metrics.expenseChange)}% from last month.`
          : `Note: Expenses increased by ${metrics.expenseChange}% this month.`
        }
        icon={TrendingUp}
        type={metrics.expenseChange < 0 ? "positive" : "warning"}
      />

      <InsightCard 
        title="Savings Analysis"
        description={metrics.isSaving 
          ? `You've saved ${metrics.savingsRate}% of your income. Keep it up!`
          : `Warning: Expenses exceeded income this month.`
        }
        icon={metrics.isSaving ? CheckCircle2 : AlertTriangle}
        type={metrics.isSaving ? "positive" : "warning"}
      />

      <InsightCard 
        title="Optimization Tip"
        description="Switching to weekly planning could save you up to $120/month."
        icon={Zap}
        type="neutral"
      />
    </div>
  );
};

export default InsightCards;
