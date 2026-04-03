import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sun, Moon, Bell, ShieldCheck, Eye, ChevronDown } from 'lucide-react';
import useFinanceStore from '../../store/useFinanceStore';

const Header = () => {
  const { darkMode, toggleDarkMode, userRole, setUserRole } = useFinanceStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 bg-secondary/30 hover:bg-secondary/50 rounded-xl px-3 py-1.5 border border-border/40 transition-all active:scale-95"
          >
            {userRole === 'Admin' ? <ShieldCheck className="h-4 w-4 text-primary" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
            <span className="text-xs font-bold tracking-tight">{userRole}</span>
            <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute right-0 top-full mt-2 w-32 overflow-hidden rounded-xl border bg-popover/90 p-1 shadow-xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => {
                  setUserRole('Admin');
                  setIsOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-all hover:bg-secondary/80 ${userRole === 'Admin' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Admin
              </button>
              <button
                onClick={() => {
                  setUserRole('Viewer');
                  setIsOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-all hover:bg-secondary/80 ${userRole === 'Viewer' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
              >
                <Eye className="h-3.5 w-3.5" />
                Viewer
              </button>
            </div>
          )}
        </div>
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
