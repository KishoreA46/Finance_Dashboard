import React, { useMemo, useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  subMonths, 
  subWeeks, 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isWithinInterval 
} from 'date-fns';
import useFinanceStore from '../../store/useFinanceStore';
import { formatCurrency, cn } from '../../lib/utils';

const BalanceTrend = () => {
  const { transactions } = useFinanceStore();
  const [timeRange, setTimeRange] = useState(6);

  const data = useMemo(() => {
    const isWeekly = timeRange === 1 || timeRange === 3;
    const count = timeRange === 1 ? 4 : timeRange === 3 ? 12 : 6;
    
    return Array.from({ length: count }, (_, i) => {
      let start, end, label;
      if (isWeekly) {
        const date = subWeeks(new Date(), i);
        start = startOfWeek(date);
        end = endOfWeek(date);
        label = `W${count - i}`;
      } else {
        const date = subMonths(new Date(), i);
        start = startOfMonth(date);
        end = endOfMonth(date);
        label = format(date, 'MMM');
      }
      
      const periodTransactions = transactions.filter((t) => 
        isWithinInterval(new Date(t.date), { start, end })
      );

      const income = periodTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = periodTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        name: label,
        balance: income - expenses,
        income,
        expenses,
        start
      };
    })
    .sort((a, b) => a.start - b.start);
  }, [transactions, timeRange]);

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold tracking-tight">Balance Trend</h3>
          <p className="text-sm text-muted-foreground font-medium">
            {timeRange === 6 ? 'Monthly' : 'Weekly'} net balance overview
          </p>
        </div>
        <div className="flex bg-secondary/50 p-1 rounded-xl w-fit">
          {[1, 3, 6].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                "px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
                timeRange === range 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {range}M
            </button>
          ))}
        </div>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fontWeight: 500, fill: 'hsl(var(--muted-foreground))' }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fontWeight: 500, fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--popover))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                padding: '12px'
              }}
              itemStyle={{ fontWeight: 600, fontSize: '13px' }}
              labelStyle={{ fontWeight: 800, marginBottom: '4px', color: 'hsl(var(--foreground))' }}
              formatter={(value) => [formatCurrency(value), 'Balance']}
            />
            <Area 
              type="monotone" 
              dataKey="balance" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorBalance)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BalanceTrend;
