import React, { useEffect, useState } from 'react';
import { ShoppingCart, DollarSign, Clock, AlertTriangle, TrendingUp, Package, Shield, Lock, RefreshCcw, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { StatCard } from '@/src/components/dashboard/StatCard';
import { TrendsChart, TrendData } from '@/src/components/dashboard/TrendsChart';
import { RecentIncursions } from '@/src/components/dashboard/RecentIncursions';
import api from '@/src/lib/api';
import { cn } from '@/src/lib/utils';
import { Page, Order } from '@/src/types';
import { useAuth } from '@/src/context/AuthContext';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  flaggedOrders: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: {
    id: string;
    customer: string;
    amount: number;
    status: string;
    fraudScore: number;
    date: string;
  }[];
  trends: TrendData[];
  activityLog: {
    type: 'order' | 'fraud' | 'auth' | 'system' | 'shipping';
    message: string;
    time: string;
  }[];
  incursions: any[];
}

export const Dashboard: React.FC<{ onPageChange: (page: Page) => void }> = ({ onPageChange }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager' || isAdmin;
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    Promise.all([
      api.get('/dashboard'),
      api.get('/orders')
    ]).then(([statsRes, ordersRes]) => {
      setStats(statsRes.data);
      setOrders(ordersRes.data);
    }).catch(err => console.error('Dashboard data error:', err));
  }, []);

  const fmt = (n: number) =>
    n >= 1000 ? `৳${(n / 1000).toFixed(1)}k` : `৳${n}`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-6 py-8"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Orders" 
          value={stats ? (stats.totalOrders || 0).toLocaleString() : '—'} 
          change="12.5%" 
          isPositive={true} 
          icon={ShoppingCart} 
          color="primary"
          sparklineData={[25, 18, 22, 12, 15, 5, 8]}
        />
        <StatCard 
          title="Revenue" 
          value={isAdmin || isManager ? (stats ? fmt(stats.totalRevenue || 0) : '—') : '••••••'} 
          change={isAdmin || isManager ? "8.2%" : ""} 
          isPositive={true} 
          icon={DollarSign} 
          color="secondary"
          sparklineData={isAdmin || isManager ? [20, 25, 15, 18, 10, 12] : []}
        />
        <StatCard 
          title="Customers" 
          value={stats ? (stats.totalCustomers || 0).toLocaleString() : '—'} 
          change="3.1%" 
          isPositive={true} 
          icon={Clock} 
          color="tertiary"
          sparklineData={[10, 12, 20, 18, 25]}
        />
        <StatCard 
          title="Fraud Alerts" 
          value={stats ? (stats.flaggedOrders || 0).toLocaleString() : '—'} 
          change="24.0%" 
          isPositive={false} 
          icon={AlertTriangle} 
          color="error"
          sparklineData={[25, 22, 28, 15, 10, 5]}
          onClick={() => onPageChange('alerts')}
        />
      </div>

      {/* Order Pipeline — populated from recentOrders */}
      <div className="mt-8 bg-surface-container rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-on-surface">Recent Transactions</h3>
            <p className="text-on-surface-variant text-sm">Latest orders from the database</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/10 rounded-full">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Connected</span>
          </div>
        </div>
        <div className="space-y-3">
          {orders.slice(0, 5).map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-container-high transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <ShoppingCart size={16} />
              </div>
              <p className="flex-1 text-sm font-bold text-on-surface">{order.id}</p>
              <p className="text-sm text-on-surface-variant">{order.customer}</p>
              <p className="text-sm font-bold">{isAdmin || isManager ? `৳${(order.amount || 0).toLocaleString()}` : '৳••••'}</p>
              <div className={cn(
                "px-2 py-0.5 rounded text-[10px] font-black uppercase",
                order.status === 'completed' ? 'bg-secondary/10 text-secondary' :
                order.status === 'flagged' ? 'bg-error/10 text-error' :
                'bg-primary/10 text-primary'
              )}>{order.status}</div>
            </motion.div>
          ))}
          {orders.length === 0 && !stats && (
            <p className="text-center text-on-surface-variant py-8 text-sm">Loading from database...</p>
          )}
          {orders.length === 0 && stats && (
            <p className="text-center text-on-surface-variant py-8 text-sm">No recent transactions found.</p>
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TrendsChart data={stats?.trends} />
        </div>
        <div>
          <RecentIncursions onPageChange={onPageChange} data={stats?.incursions} />
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="mt-8 bg-surface-container-low rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary">Recent Activity</h3>
          <span className="text-[10px] text-on-surface-variant">Real-time Feed</span>
        </div>
        <div className="space-y-3">
          {(stats?.activityLog ?? [
            { type: 'order', message: 'Order #ORD-88219 placed by Shihab Shoron', time: '2 min ago' },
            { type: 'fraud', message: 'Fraud check done for ORD-88219 — Safe', time: '5 min ago' },
            { type: 'auth', message: 'Admin logged in', time: '8 min ago' },
            { type: 'shipping', message: 'Order #SHIP-88219 sent from Warehouse', time: '12 min ago' },
            { type: 'system', message: `Data synchronization successful`, time: 'just now' },
          ]).map((item, i) => {
            const getIcon = () => {
              switch(item.type) {
                case 'order': return ShoppingCart;
                case 'fraud': return Shield;
                case 'auth': return Lock;
                case 'shipping': return Package;
                case 'system': return RefreshCcw;
                default: return Zap;
              }
            };
            const getColor = () => {
              switch(item.type) {
                case 'order': return 'text-primary';
                case 'fraud': return 'text-secondary';
                case 'auth': return 'text-error';
                case 'shipping': return 'text-tertiary';
                case 'system': return 'text-primary';
                default: return 'text-on-surface-variant';
              }
            };
            const Icon = getIcon();
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-container transition-colors group"
              >
                <div className={`w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center ${getColor()}`}>
                  <Icon size={16} />
                </div>
                <p className="flex-1 text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">{item.message}</p>
                <span className="text-[10px] text-on-surface-variant whitespace-nowrap">{item.time}</span>
              </motion.div>
            );
          })}
          {!stats && (
            <p className="text-center text-on-surface-variant py-4 text-xs italic">Awaiting connection...</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
