import React from 'react';
import { 
  ShieldCheck,
  LayoutGrid, 
  Receipt, 
  PlusCircle, 
  Users, 
  Radar, 
  Settings,
  Truck,
  FileText,
  LogOut, Box, Store, Lock,
  ChevronDown, ChevronRight, UserCircle, User
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Page } from '@/src/types';
import { useAuth } from '@/src/context/AuthContext';

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange, onLogout }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const menuGroups = [
    {
      title: 'Overview',
      items: [
        { id: 'dash', label: 'Dashboard', icon: LayoutGrid },
        { id: 'products', label: 'Products', icon: Store },
      ]
    },
    {
      title: 'Sales',
      items: [
        { id: 'orders', label: 'Orders', icon: Receipt },
        { id: 'create', label: 'New Order', icon: PlusCircle },
        { id: 'invoices', label: 'Invoices', icon: FileText },
      ]
    },
    {
      title: 'Operations',
      items: [
        { id: 'users', label: 'Customers', icon: Users },
        { id: 'alerts', label: 'Fraud Alerts', icon: Radar },
        { id: 'tracking', label: 'Tracking', icon: Truck },
      ]
    },
    {
      title: 'System',
      items: [
        { 
          id: 'settings', 
          label: 'Settings', 
          icon: Settings,
          subItems: [
            { id: 'settings-courier', label: 'Couriers' },
            { id: 'settings-fraud', label: 'Fraud Check' },
            { id: 'settings-webhook', label: 'Notifications' },
          ]
        },
        { id: 'profile', label: 'Account', icon: UserCircle },
      ]
    }
  ];

  const [expandedMenu, setExpandedMenu] = React.useState<string | null>(null);

  const toggleMenu = (id: string) => {
    setExpandedMenu(expandedMenu === id ? null : id);
  };

  return (
    <aside className="hidden md:flex h-full w-72 fixed left-0 top-0 z-40 flex-col py-8 bg-surface-container-low/60 backdrop-blur-xl shadow-[40px_0_40px_rgba(11,19,38,0.08)]">
      <div className="px-8 mb-10 flex items-center space-x-3">
        <div className="relative">
          <img src="/favicon.png" className="w-9 h-9 object-contain" alt="OrderShield Icon" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-secondary rounded-full shadow-[0_0_6px_#4ae176]" />
        </div>
        <div className="flex flex-col">
          <span className="text-primary font-bold tracking-tighter text-lg uppercase leading-tight">OrderShield</span>
          <span className="text-on-surface-variant text-[9px] font-semibold tracking-[0.15em] uppercase">Order System</span>
        </div>
      </div>

      <button 
        onClick={() => onPageChange('profile')}
        className="px-6 mb-8 flex flex-col items-start group hover:opacity-80 transition-all active:scale-95 text-left w-full"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-primary/20 bg-primary/10 flex items-center justify-center text-primary group-hover:border-primary transition-colors">
              <User size={24} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary rounded-full border-2 border-background flex items-center justify-center">
              <ShieldCheck size={8} className="text-on-secondary" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-primary font-black text-xs uppercase tracking-widest group-hover:text-on-surface transition-colors">{user?.name}</span>
            <span className="text-on-surface-variant text-[10px] font-bold">{user?.role === 'admin' ? 'Manager' : 'Staff'}</span>
          </div>
        </div>
        <div className="bg-primary/10 px-2 py-0.5 rounded text-[10px] text-primary font-black tracking-widest uppercase border border-primary/20">
          {user?.role} Access
        </div>
      </button>

      <nav className="flex-1 space-y-6 overflow-y-auto no-scrollbar">
        {menuGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <h3 className="px-8 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/50 mb-2">
              {group.title}
            </h3>
            {group.items.map((item) => {
              const Icon = item.icon;
              const hasSubItems = 'subItems' in item && item.subItems;
              const isExpanded = expandedMenu === item.id;
              
              const isAnyChildActive = hasSubItems && item.subItems.some(sub => sub.id === currentPage);
              const isActive = currentPage === item.id || isAnyChildActive;
              
              return (
                <div key={item.id} className="flex flex-col">
                  <button
                    onClick={() => {
                      if (hasSubItems) {
                        toggleMenu(item.id);
                      } else {
                        onPageChange(item.id as Page);
                      }
                    }}
                    className={cn(
                      "flex items-center w-full px-8 py-2.5 transition-all group text-left",
                      isActive && !hasSubItems
                        ? "bg-surface-container-high text-primary rounded-r-full mr-4" 
                        : "text-on-surface-variant hover:text-primary hover:bg-surface-container/50",
                      isAnyChildActive && "text-primary"
                    )}
                  >
                    <Icon className="mr-4" size={18} fill={isActive && !hasSubItems ? "currentColor" : "none"} />
                    <span className="font-bold text-[11px] uppercase tracking-widest flex-1">
                      {item.label}
                      {item.id === 'settings' && !isAdmin && (
                        <Lock size={10} className="inline ml-2 text-error/60" />
                      )}
                    </span>
                    {hasSubItems && (
                      isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                    )}
                  </button>

                  {hasSubItems && isExpanded && (
                    <div className="flex flex-col mt-1 bg-surface-container-lowest/30 py-2">
                      {item.subItems.map(subItem => (
                        <button
                          key={subItem.id}
                          onClick={() => onPageChange(subItem.id as Page)}
                          className={cn(
                            "flex items-center w-full pl-16 pr-8 py-2 transition-all group text-left text-[10px] uppercase tracking-widest font-bold",
                            currentPage === subItem.id
                              ? "bg-surface-container-high text-primary rounded-r-full mr-4 border-l-2 border-primary" 
                              : "text-on-surface-variant hover:text-primary hover:bg-surface-container/30 border-l-2 border-transparent"
                          )}
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="px-6 pt-4 space-y-4">
        <div className="bg-surface-container-high rounded-xl p-4">
          <p className="text-[10px] font-bold text-primary mb-1 uppercase">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#4ae176]"></div>
            <p className="text-xs text-on-surface">System is Running</p>
          </div>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center w-full px-4 py-3 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-lg transition-all group"
          >
            <LogOut className="mr-3" size={18} />
            <span className="font-semibold text-xs uppercase tracking-widest">Logout</span>
          </button>
        )}
      </div>
    </aside>
  );
};
