import React from 'react';
import { Search, ArrowDownNarrowWide, ArrowUpNarrowWide } from 'lucide-react';
import useFinanceStore from '../../store/useFinanceStore';
import { cn } from '../../lib/utils';

const categories = [
  'All', 'Food', 'Rent', 'Salary', 'Freelance', 'Transport', 'Shopping', 'Entertainment', 'Healthcare', 'Utilities'
];

const Filters = () => {
  const { filters, setFilter } = useFinanceStore();

  return (
    <div className="flex flex-col gap-4 p-5 bg-card border rounded-2xl shadow-sm transition-all hover:shadow-md animate-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => setFilter({ search: e.target.value })}
            className="w-full rounded-xl border bg-secondary/30 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:bg-background focus:ring-2 focus:ring-primary/20 hover:bg-secondary/50"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <select
              value={filters.type}
              onChange={(e) => setFilter({ type: e.target.value })}
              className="rounded-xl border bg-secondary/30 px-4 py-2.5 text-sm font-semibold outline-none transition-all focus:bg-background focus:ring-2 focus:ring-primary/20 hover:bg-secondary/50"
            >
              <option value="All">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="flex items-center gap-2 flex-1 sm:flex-none">
            <select
              value={filters.category}
              onChange={(e) => setFilter({ category: e.target.value })}
              className="w-full sm:w-auto rounded-xl border bg-secondary/30 px-4 py-2.5 text-sm font-semibold outline-none transition-all focus:bg-background focus:ring-2 focus:ring-primary/20 hover:bg-secondary/50"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })}
              className="flex h-10 w-10 items-center justify-center rounded-xl border bg-secondary/30 transition-all hover:bg-secondary/50 active:scale-90"
              title={`Sort ${filters.sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              {filters.sortOrder === 'asc' ? (
                <ArrowUpNarrowWide className="h-4 w-4 text-primary" />
              ) : (
                <ArrowDownNarrowWide className="h-4 w-4 text-primary" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
