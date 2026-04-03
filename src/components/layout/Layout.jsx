import React, { useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import useFinanceStore from '../../store/useFinanceStore';

const Layout = ({ children }) => {
  const { darkMode } = useFinanceStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 px-4 py-8 md:px-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
