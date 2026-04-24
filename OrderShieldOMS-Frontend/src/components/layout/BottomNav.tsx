import React from 'react';
import { LayoutGrid, ShoppingCart, AlertTriangle, Settings, PlusCircle, FileText, Truck } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Page } from '@/src/types';

interface BottomNavProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onPageChange }) => {
  const navItems = [
    { id: 'dash', label: 'Dash', icon: LayoutGrid, isCenter: false },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, isCenter: false },
    { id: 'create', label: 'Create', icon: PlusCircle, isCenter: true },
    { id: 'invoices', label: 'Invoices', icon: FileText, isCenter: false },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle, isCenter: false },
  ] as const;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-background/80 backdrop-blur-lg rounded-t-3xl border-t border-outline-variant/20 shadow-2xl">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;
        
        if (item.isCenter) {
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={cn(
                "flex flex-col items-center justify-center rounded-2xl p-2 scale-110 transition-all active:scale-95",
                isActive ? "bg-primary-container text-white shadow-lg shadow-primary/20" : "text-on-surface-variant"
              )}
            >
              <Icon size={24} fill={isActive ? "currentColor" : "none"} />
              <span className="font-medium text-[10px] mt-1">{item.label}</span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={cn(
              "flex flex-col items-center justify-center p-2 transition-all active:scale-90",
              isActive ? "text-primary" : "text-on-surface-variant hover:text-white"
            )}
          >
            <Icon size={20} fill={isActive ? "currentColor" : "none"} />
            <span className="font-medium text-[10px] mt-1">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
