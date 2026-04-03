import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialTransactions } from '../data/mockData';

const useFinanceStore = create(
  persist(
    (set) => ({
      transactions: initialTransactions,
      activeTab: 'dashboard',
      filters: {
        search: '',
        type: 'All',
        category: 'All',
        sortBy: 'date',
        sortOrder: 'desc'
      },
      darkMode: false,

      setActiveTab: (tab) => set({ activeTab: tab }),

      addTransaction: (transaction) => set((state) => ({
        transactions: [
          { ...transaction, id: Math.max(...state.transactions.map(t => t.id), 0) + 1 },
          ...state.transactions
        ]
      })),
      
      updateTransaction: (updated) => set((state) => ({
        transactions: state.transactions.map((t) => (t.id === updated.id ? updated : t))
      })),

      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id)
      })),

      setFilter: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters }
      })),

      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      resetData: () => set({ transactions: initialTransactions })
    }),
    {
      name: 'finance-dashboard-storage',
    }
  )
);

export default useFinanceStore;
