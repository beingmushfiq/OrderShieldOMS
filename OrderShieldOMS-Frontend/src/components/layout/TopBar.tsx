import React, { useState, useEffect } from 'react';
import { ChevronRight, Bell, Shield, User } from 'lucide-react';
import { Page } from '@/src/types';
import { useAuth } from '@/src/context/AuthContext';
import ThemeToggle from './ThemeToggle';
import api from '@/src/lib/api';
import { cn } from '@/src/lib/utils';

interface TopBarProps {
  currentPage: Page;
  title: string;
  onPageChange: (page: Page) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ currentPage, title, onPageChange }) => {
  const { user } = useAuth();
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    const fetchAlertCount = async () => {
      try {
        const response = await api.get('/alerts');
        setAlertCount(response.data.length);
      } catch (err) {
        console.error('Failed to fetch alert count');
      }
    };

    fetchAlertCount();
    // Poll every 30 seconds for new alerts
    const interval = setInterval(fetchAlertCount, 30000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <header className="w-full sticky top-0 z-50 flex justify-between items-center px-6 py-4 bg-background/80 backdrop-blur-md border-b border-outline-variant/10">
      <div className="flex flex-col">
        <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
          <span>OrderShield</span>
          <ChevronRight size={12} />
          <span className="text-primary">{currentPage}</span>
        </div>
        <h1 className="font-bold tracking-tight text-xl text-primary uppercase italic">{title}</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <ThemeToggle compact />

        <button 
          onClick={() => onPageChange('alerts')}
          className="relative p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant group active:scale-95 transition-all"
        >
          <Bell size={20} className={cn(
            "group-hover:text-primary transition-colors",
            alertCount > 0 && "text-error animate-pulse"
          )} />
          {alertCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-error shadow-[0_0_8px_rgba(255,68,68,0.6)]"></span>
            </span>
          )}
        </button>
        
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high/50">
          <Shield size={14} className={cn(alertCount > 0 ? "text-error" : "text-secondary")} />
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-widest",
            alertCount > 0 ? "text-error" : "text-secondary"
          )}>
            {alertCount > 0 ? 'Threat Detected' : 'Protected'}
          </span>
        </div>

        <button 
          onClick={() => onPageChange('profile')}
          className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-full bg-surface-container-high/30 border border-outline-variant/10 hover:bg-surface-container-high transition-all active:scale-95 group"
        >
          <div className="h-8 w-8 rounded-full overflow-hidden border border-primary/20 shadow-lg flex items-center justify-center bg-primary/10 text-primary">
            <User size={16} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-on-surface group-hover:text-primary transition-colors">
            {user?.name?.split(' ')[0] || 'User'}
          </span>
        </button>
      </div>
    </header>
  );
};
