import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import useFinanceStore from '../../store/useFinanceStore';
import { formatCurrency } from '../../lib/utils';

const COLORS = [
  'hsl(var(--primary))',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#f43f5e',
  '#14b8a6',
];

const SpendingChart = () => {
  const { transactions } = useFinanceStore();

  const { data, totalExpenses } = useMemo(() => {
    const categoryTotals = {};
    let total = 0;
    
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
        total += t.amount;
      });

    const chartData = Object.keys(categoryTotals).map((category, index) => ({
      name: category,
      value: categoryTotals[category],
      color: COLORS[index % COLORS.length]
    })).sort((a, b) => b.value - a.value);

    return { data: chartData, totalExpenses: total };
  }, [transactions]);

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
      <div className="mb-6">
        <h3 className="text-lg font-bold tracking-tight">Spending Breakdown</h3>
        <p className="text-sm text-muted-foreground font-medium">Expenses by category</p>
      </div>
      <div className="h-[300px] w-full relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total</span>
          <span className="text-xl font-black">{formatCurrency(totalExpenses)}</span>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
              stroke="transparent"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--popover))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                padding: '8px 12px'
              }}
              itemStyle={{ fontWeight: 600, fontSize: '13px' }}
              formatter={(value) => [formatCurrency(value), 'Spent']}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: 'hsl(var(--muted-foreground))' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpendingChart;
