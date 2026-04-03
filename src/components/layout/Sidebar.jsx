import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TableProperties, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  Menu,
  X,
  Wallet
} from 'lucide-react';
import { cn } from '../../lib/utils';
import useFinanceStore from '../../store/useFinanceStore';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'transactions', label: 'Transactions', icon: TableProperties, path: '/transactions' },
  { id: 'insights', label: 'Insights', icon: BarChart3, path: '/insights' },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const NavContent = () => (
    <div className="flex h-full flex-col">
      <div className={cn(
        "flex h-16 items-center border-b px-6 transition-all duration-300",
        isCollapsed ? "justify-center px-0" : "justify-between"
      )}>
        {!isCollapsed && (
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
            <Wallet className="h-6 w-6" />
            <span>FinanceIQ</span>
          </div>
        )}
        {isCollapsed && <Wallet className="h-6 w-6 text-primary" />}
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex h-6 w-6 items-center justify-center rounded-md border bg-background text-muted-foreground transition-all hover:text-foreground active:scale-95"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform duration-300", isCollapsed && "rotate-180")} />
        </button>

        <button 
          onClick={() => setIsMobileOpen(false)}
          className="flex md:hidden h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1.5 p-4 mt-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.path);
                setIsMobileOpen(false);
              }}
              className={cn(
                "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                isCollapsed && "justify-center px-0"
              )}
            >
              <Icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive && "scale-110")} />
              {!isCollapsed && <span>{item.label}</span>}
              
              {isCollapsed && (
                <div className="absolute left-full ml-4 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 z-50 pointer-events-none">
                  <div className="bg-popover border text-popover-foreground px-2 py-1 rounded text-xs whitespace-nowrap shadow-md">
                    {item.label}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </nav>
      
      <div className="mt-auto border-t p-4 space-y-1.5">
        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground transition-all hover:bg-secondary hover:text-foreground">
          <Settings className="h-5 w-5" />
          {!isCollapsed && <span>Settings</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {!isMobileOpen && (
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="fixed left-4 top-4 z-40 flex md:hidden items-center justify-center h-9 w-9 rounded-xl bg-background border shadow-md text-foreground active:scale-90 transition-all hover:bg-secondary"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}
      <aside className={cn(
        "fixed left-0 top-0 z-40 hidden h-screen bg-background border-r transition-all duration-500 ease-in-out md:flex flex-col shadow-sm",
        isCollapsed ? "w-20" : "w-64"
      )}>
        <NavContent />
      </aside>
      <div className={cn(
        "fixed inset-0 z-50 bg-background/60 backdrop-blur-sm transition-all duration-300 md:hidden",
        isMobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
      )} onClick={() => setIsMobileOpen(false)}>
        <aside 
          className={cn(
            "fixed left-0 top-0 h-screen w-72 bg-background border-r transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) shadow-2xl",
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <NavContent />
        </aside>
      </div>
      <div className={cn(
        "hidden md:block shrink-0 transition-all duration-500 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )} />
    </>
  );
};

export default Sidebar;
