import React from 'react';
import { ChevronRight, Bell, Shield, User } from 'lucide-react';
import { Page } from '@/src/types';
import { useAuth } from '@/src/context/AuthContext';
import ThemeToggle from './ThemeToggle';

interface TopBarProps {
  currentPage: Page;
  title: string;
  onPageChange: (page: Page) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ currentPage, title, onPageChange }) => {
  const { user } = useAuth();
  
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
          <Bell size={20} className="group-hover:text-primary transition-colors" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full shadow-[0_0_4px_rgba(255,180,171,0.6)]" />
        </button>
        
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high/50">
          <Shield size={14} className="text-secondary" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Protected</span>
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
