import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import SummaryCards from './components/dashboard/SummaryCards';
import BalanceTrend from './components/dashboard/BalanceTrend';
import SpendingChart from './components/dashboard/SpendingChart';
import TransactionTable from './components/transactions/TransactionTable';
import TransactionModal from './components/transactions/TransactionModal';
import Filters from './components/transactions/Filters';
import InsightCards from './components/insights/InsightCards';
import ComparisonChart from './components/insights/ComparisonChart';
import { Plus } from 'lucide-react';

const Dashboard = ({ onAdd, onEdit }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Overview</h2>
          <p className="text-sm text-muted-foreground">Detailed overview of your financial status.</p>
        </div>
        <button 
          onClick={onAdd}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-lg active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Add Transaction
        </button>
      </div>
      <SummaryCards />
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3 hover:cursor-default">
        <div className="lg:col-span-2">
          <BalanceTrend />
        </div>
        <div className="lg:col-span-1">
          <SpendingChart />
        </div>
      </div>
    </div>
  );
};

const Transactions = ({ onAdd, onEdit }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Transactions</h2>
          <p className="text-sm text-muted-foreground">Manage and track your income and expenses.</p>
        </div>
        <button 
          onClick={onAdd}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-lg active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Add Transaction
        </button>
      </div>
      <Filters />
      <TransactionTable onEdit={onEdit} />
    </div>
  );
};

const Insights = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Financial Insights</h2>
        <p className="text-sm text-muted-foreground">AI-powered analytics and observations.</p>
      </div>
    </div>
    <InsightCards />
    <ComparisonChart />
  </div>
);

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  return (
    <Routes>
      <Route 
        path="/*"
        element={
          <Layout>
            <div className="max-w-[1400px] mx-auto pb-8 px-4 sm:px-0">
              <Routes>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route 
                  path="dashboard" 
                  element={<Dashboard onAdd={handleAdd} onEdit={handleEdit} />} 
                />
                <Route 
                  path="transactions" 
                  element={<Transactions onAdd={handleAdd} onEdit={handleEdit} />} 
                />
                <Route path="insights" element={<Insights />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </div>
            <TransactionModal 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)} 
              editingTransaction={editingTransaction}
            />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
