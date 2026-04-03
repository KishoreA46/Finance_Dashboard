import React, { useMemo, useState } from 'react';
import { Edit2, Trash2, SearchX, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import useFinanceStore from '../../store/useFinanceStore';
import { formatCurrency, cn } from '../../lib/utils';
import { format } from 'date-fns';

const ITEMS_PER_PAGE = 10;

const TransactionTable = ({ onEdit }) => {
  const { transactions, filters, deleteTransaction } = useFinanceStore();
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (t) => 
          t.description.toLowerCase().includes(searchLower) || 
          t.category.toLowerCase().includes(searchLower)
      );
    }

    if (filters.type !== 'All') {
      result = result.filter((t) => t.type === filters.type);
    }

    if (filters.category !== 'All') {
      result = result.filter((t) => t.category === filters.category);
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (filters.sortBy === 'date') {
        comparison = new Date(a.date) - new Date(b.date);
      } else {
        comparison = a.amount - b.amount;
      }
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [transactions, filters]);

  const summary = useMemo(() => {
    const total = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
    const count = filteredTransactions.length;
    const income = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return { total, count, income, expenses };
  }, [filteredTransactions]);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleExport = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const rows = filteredTransactions.map(t => [
      format(new Date(t.date), 'yyyy-MM-dd'),
      t.description,
      t.category,
      t.type,
      t.amount
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (filteredTransactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed rounded-2xl bg-card transition-all">
        <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4">
          <SearchX className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-xl font-bold">No results found</h3>
        <p className="text-sm text-muted-foreground max-w-xs mt-1">We couldn't find any transactions matching your current filters.</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 text-sm font-bold text-primary hover:underline"
        >
          Clear all filters
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/40">
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Results</p>
          <p className="text-lg font-black">{summary.count}</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Income</p>
          <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(summary.income)}</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Expenses</p>
          <p className="text-lg font-black text-rose-600 dark:text-rose-400">{formatCurrency(summary.expenses)}</p>
        </div>
        <div className="flex items-center justify-start lg:justify-end">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 rounded-xl border bg-background px-4 py-2 text-xs font-bold transition-all hover:bg-secondary hover:shadow-sm active:scale-95"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="relative group">
        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b bg-muted/30 text-[11px] font-black uppercase tracking-widest text-muted-foreground/70">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {paginatedTransactions.map((t) => (
                  <tr key={t.id} className="transition-all hover:bg-secondary/40 group">
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-muted-foreground">
                      {format(new Date(t.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground/90">{t.description}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-lg bg-secondary/80 px-2 py-1 text-[10px] font-bold uppercase tracking-tight">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 capitalize">
                      <span className={cn(
                        "inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter",
                        t.type === 'income' ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400"
                      )}>
                        {t.type}
                      </span>
                    </td>
                    <td className={cn(
                      "px-6 py-4 text-right font-black tracking-tight text-base",
                      t.type === 'income' ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                    )}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <button 
                          onClick={() => onEdit(t)}
                          className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors active:scale-90"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this transaction?')) {
                              deleteTransaction(t.id);
                            }
                          }}
                          className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-500 transition-colors active:scale-90"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between border-t px-6 py-4 bg-muted/10 gap-4">
              <p className="text-xs font-medium text-muted-foreground">
                Showing <span className="font-bold text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-bold text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)}</span> of <span className="font-bold text-foreground">{filteredTransactions.length}</span>
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border bg-background transition-all hover:bg-secondary disabled:opacity-30 active:scale-90"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        "h-8 w-8 rounded-lg text-xs font-bold transition-all active:scale-90",
                        currentPage === page 
                          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20" 
                          : "hover:bg-secondary text-muted-foreground"
                      )}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border bg-background transition-all hover:bg-secondary disabled:opacity-30 active:scale-90"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
