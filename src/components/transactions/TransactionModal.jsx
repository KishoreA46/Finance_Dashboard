import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import useFinanceStore from '../../store/useFinanceStore';
import { cn } from '../../lib/utils';

const CATEGORIES = ['Food', 'Rent', 'Salary', 'Freelance', 'Transport', 'Shopping', 'Entertainment', 'Healthcare', 'Utilities'];

const TransactionModal = ({ isOpen, onClose, editingTransaction }) => {
  const { addTransaction, updateTransaction } = useFinanceStore();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    category: 'Food',
    type: 'expense'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        ...editingTransaction,
        amount: editingTransaction.amount.toString()
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: '',
        category: 'Food',
        type: 'expense'
      });
    }
  }, [editingTransaction]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Valid positive amount is required';
    }
    if (!formData.date) newErrors.date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      ...formData,
      amount: parseFloat(formData.amount)
    };

    if (editingTransaction) {
      updateTransaction(data);
    } else {
      addTransaction(data);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border bg-card shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-bold tracking-tight">
            {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
          </h2>
          <button 
            onClick={onClose}
            className="rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium leading-none">Type</label>
              <div className="flex p-1 bg-secondary rounded-lg">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'income' })}
                  className={cn(
                    "flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                    formData.type === 'income' ? "bg-card shadow-sm text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                  )}
                >
                  Income
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'expense' })}
                  className={cn(
                    "flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                    formData.type === 'expense' ? "bg-card shadow-sm text-rose-600 dark:text-rose-400" : "text-muted-foreground"
                  )}
                >
                  Expense
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium leading-none">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={cn(
                  "w-full bg-background border rounded-lg px-3 py-2 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary",
                  errors.date && "border-rose-500"
                )}
              />
              {errors.date && <p className="text-[10px] text-rose-500 font-medium">{errors.date}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium leading-none">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-background border rounded-lg px-3 py-2 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium leading-none">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className={cn(
                    "w-full bg-background border rounded-lg pl-6 pr-3 py-2 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary",
                    errors.amount && "border-rose-500"
                  )}
                />
              </div>
              {errors.amount && <p className="text-[10px] text-rose-500 font-medium">{errors.amount}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium leading-none">Description</label>
            <input
              type="text"
              placeholder="What was this for?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={cn(
                "w-full bg-background border rounded-lg px-3 py-2 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary",
                errors.description && "border-rose-500"
              )}
            />
            {errors.description && <p className="text-[10px] text-rose-500 font-medium">{errors.description}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium border rounded-lg hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all hover:shadow-lg"
            >
              <Save className="h-4 w-4" />
              {editingTransaction ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
