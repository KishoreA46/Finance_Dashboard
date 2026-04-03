import React from 'react';
import { useLocation } from 'react-router-dom';
import { Sun, Moon, Bell } from 'lucide-react';
import useFinanceStore from '../../store/useFinanceStore';

const Header = () => {
  const { darkMode, toggleDarkMode } = useFinanceStore();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname.split('/').pop();
    switch (path) {
      case 'dashboard': return 'Dashboard';
      case 'transactions': return 'Transactions';
      case 'insights': return 'Insights';
      default: return 'Overview';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur transition-all md:px-8">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 md:hidden pl-10">
            <h1 className="text-xl font-black tracking-tighter text-primary">F<span className="text-foreground">IQ</span></h1>
        </div>
        <div className="hidden md:block">
          <nav className="flex items-center text-sm font-medium text-muted-foreground">
            <span className="hover:text-foreground cursor-default transition-colors font-bold">FinanceIQ</span>
            <span className="mx-2 text-muted-foreground/40">/</span>
            <span className="text-foreground font-bold tracking-tight">{getPageTitle()}</span>
          </nav>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button className="rounded-full p-2 text-muted-foreground transition-all hover:bg-secondary hover:text-foreground active:scale-95">
          <Bell className="h-5 w-5" />
        </button>
        <button 
          onClick={toggleDarkMode}
          className="rounded-full p-2 text-muted-foreground transition-all hover:bg-secondary hover:text-foreground active:scale-95"
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>
    </header>
  );
};

export default Header;
