import React from 'react';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import useFinanceStore from '../../store/useFinanceStore';
import { formatCurrency, formatPercent, cn } from '../../lib/utils';

const SummaryCard = ({ title, value, icon, trend, trendValue, gradient, iconColor }) => {
  const Icon = icon;
  const isPositive = trend === 'up';

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group",
      gradient
    )}>
      <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
      
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">{title}</p>
          <h3 className="text-2xl font-black tracking-tight">{value}</h3>
        </div>
        <div className={cn("rounded-2xl p-3 shadow-inner", iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className={cn(
          "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm",
          isPositive 
            ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" 
            : "bg-rose-500/20 text-rose-600 dark:text-rose-400"
        )}>
          {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {trendValue}
        </div>
        <span className="text-[10px] font-medium text-muted-foreground/70">from last month</span>
      </div>
    </div>
  );
};

const SummaryCards = () => {
  const { transactions } = useFinanceStore();

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (totalIncome - totalExpenses) / totalIncome : 0;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard 
        title="Total Balance" 
        value={formatCurrency(totalBalance)} 
        icon={Wallet} 
        trend="up" 
        trendValue="+2.5%" 
        gradient="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10"
        iconColor="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
      />
      <SummaryCard 
        title="Total Income" 
        value={formatCurrency(totalIncome)} 
        icon={TrendingUp} 
        trend="up" 
        trendValue="+12.0%" 
        gradient="hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10"
        iconColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      />
      <SummaryCard 
        title="Total Expenses" 
        value={formatCurrency(totalExpenses)} 
        icon={TrendingDown} 
        trend="up" 
        trendValue="+5.4%" 
        gradient="hover:bg-rose-50/50 dark:hover:bg-rose-900/10"
        iconColor="bg-rose-500/10 text-rose-600 dark:text-rose-400"
      />
      <SummaryCard 
        title="Savings Rate" 
        value={formatPercent(savingsRate)} 
        icon={PiggyBank} 
        trend="up" 
        trendValue="+0.8%" 
        gradient="hover:bg-amber-50/50 dark:hover:bg-amber-900/10"
        iconColor="bg-amber-500/10 text-amber-600 dark:text-amber-400"
      />
    </div>
  );
};

export default SummaryCards;
