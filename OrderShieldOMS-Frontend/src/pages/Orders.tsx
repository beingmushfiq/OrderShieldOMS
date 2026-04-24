import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  Download, 
  ChevronRight, 
  X,
  ShieldCheck,
  Clock,
  User,
  CreditCard,
  Calendar,
  Loader2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Order } from '@/src/types';
import api from '@/src/lib/api';
import { toast } from 'sonner';

import { useAuth } from '@/src/context/AuthContext';

export const Orders: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager' || isAdmin;

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch from the real Laravel API on mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/orders');
        setOrders(response.data);
      } catch (err: any) {
        toast.error('Failed to load orders from the database.');
        console.error('Orders fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = activeFilter === 'All' || 
      (activeFilter === 'Pending' && order.status === 'processing') ||
      (activeFilter === 'Completed' && order.status === 'completed') ||
      (activeFilter === 'Flagged' && (order.status === 'flagged' || order.fraudScore >= 70));
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8"
    >
      {/* Search & Actions */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
        <div className="relative flex-1 w-full max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order ID, customer name or phone..."
            className="w-full bg-surface-container-low border border-outline-variant/10 rounded-2xl pl-12 pr-4 py-4 text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-high transition-all shadow-xl"
          />
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-surface-container-low text-on-surface-variant border border-outline-variant/10 rounded-2xl text-sm font-bold hover:bg-surface-container-high transition-colors">
            <Filter size={18} />
            Filters
          </button>
          <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {['All', 'Pending', 'Completed', 'Flagged'].map((f) => (
          <button 
            key={f}
            onClick={() => setActiveFilter(f)}
            className={cn(
              "px-6 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-[0.15em] transition-all whitespace-nowrap",
              activeFilter === f 
                ? "bg-primary text-on-primary shadow-lg shadow-primary/20" 
                : "bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-variant"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-surface-container-low rounded-3xl border border-outline-variant/10 overflow-hidden shadow-2xl">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <Loader2 size={36} className="text-primary animate-spin" />
            <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest">Loading orders...</p>
          </div>
        ) : (
        <>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-container-high/30 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">
                <th className="px-8 py-5">Order ID</th>
                <th className="px-6 py-5">Customer Info</th>
                <th className="px-6 py-5">Price</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Fraud Score</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredOrders.map((order) => (
                <tr 
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="hover:bg-surface-container transition-all cursor-pointer group"
                >
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <p className="font-mono text-sm font-bold text-primary">{order.id}</p>
                      <p className="text-[10px] text-on-surface-variant flex items-center gap-1 font-medium">
                        <Calendar size={10} /> {order.date}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-[10px] font-black border border-outline-variant/10">
                        {order.customer.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{order.customer}</p>
                        <p className="text-[10px] font-medium text-on-surface-variant tracking-wider">{order.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="space-y-0.5">
                      <p className="text-sm font-black">৳ {(order.amount || 0).toLocaleString()}</p>
                      <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-tighter">Total Amount</p>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className={cn(
                      "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5",
                      order.status === 'processing' && "bg-primary/10 text-primary",
                      order.status === 'cancelled' && "bg-error/10 text-error",
                      order.status === 'shipped' && "bg-secondary/10 text-secondary",
                      order.status === 'completed' && "bg-secondary/10 text-secondary",
                      order.status === 'flagged' && "bg-tertiary/10 text-tertiary"
                    )}>
                      <div className="w-1 h-1 rounded-full bg-current animate-pulse" />
                      {order.status}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "px-2 py-1 rounded text-[10px] font-black",
                        order.fraudScore < 20 ? "bg-secondary/10 text-secondary" : 
                        order.fraudScore < 50 ? "bg-tertiary/10 text-tertiary" : "bg-error/10 text-error"
                      )}>
                        {order.fraudScore}%
                      </div>
                      <div className="flex-1 h-1.5 w-20 bg-surface-container-highest rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${order.fraudScore}%` }}
                          className={cn(
                            "h-full rounded-full",
                            order.fraudScore < 20 ? "bg-secondary" : 
                            order.fraudScore < 50 ? "bg-tertiary" : "bg-error"
                          )}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 hover:bg-surface-container-high rounded-full opacity-0 group-hover:opacity-100 transition-all">
                      <ChevronRight size={20} className="text-on-surface-variant" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (
          <div className="py-24 text-center">
            <Search className="mx-auto mb-4 text-on-surface-variant/20" size={48} />
            <p className="text-on-surface-variant font-medium">No transactions found matching your criteria</p>
          </div>
        )}
        </>
        )}
      </div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-surface-container-low/95 backdrop-blur-3xl z-[110] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col border-l border-outline-variant/10"
            >
              <div className="p-6 flex items-center justify-between border-b border-outline-variant/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <ShieldCheck size={20} />
                  </div>
                  <h2 className="font-black text-lg tracking-tight uppercase">Order Details</h2>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-black text-primary">Order Summary</span>
                    <span className="text-[10px] text-on-surface-variant font-bold uppercase">{selectedOrder.date}</span>
                  </div>
                  <h3 className="text-4xl font-black tracking-tighter text-on-surface">{selectedOrder.id}</h3>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary">{selectedOrder.status}</span>
                    <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-surface-container-high text-on-surface-variant border border-outline-variant/20">Protected</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-surface-container p-6 rounded-3xl border border-outline-variant/10">
                    <div className="flex justify-between items-center mb-6">
                      <p className="text-[10px] uppercase text-on-surface-variant font-black tracking-widest">Fraud Check</p>
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-black uppercase",
                        selectedOrder.fraudScore < 30 ? "bg-secondary/10 text-secondary" : "bg-error/10 text-error"
                      )}>
                        {selectedOrder.fraudScore < 30 ? 'Safe' : 'Risky'}
                      </span>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className={cn(
                        "text-5xl font-black tracking-tighter",
                        selectedOrder.fraudScore < 30 ? "text-secondary" : selectedOrder.fraudScore < 70 ? "text-tertiary" : "text-error"
                      )}>{selectedOrder.fraudScore}</span>
                      <span className="text-on-surface-variant font-bold text-sm mb-2">/ 100</span>
                    </div>
                    <div className="w-full bg-background h-2 rounded-full mt-6 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedOrder.fraudScore}%` }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        className={cn(
                          "h-full rounded-full",
                          selectedOrder.fraudScore < 30 ? "bg-secondary" : selectedOrder.fraudScore < 70 ? "bg-tertiary" : "bg-error"
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-surface-container-low p-5 rounded-3xl border border-outline-variant/10">
                      <p className="text-[9px] uppercase text-on-surface-variant font-black tracking-widest mb-3 flex items-center gap-2">
                        <User size={12} /> Customer
                      </p>
                      <p className="text-sm font-black truncate">{selectedOrder.customer}</p>
                      <p className="text-[10px] text-on-surface-variant font-bold mt-1">{selectedOrder.phone}</p>
                    </div>
                    <div className="bg-surface-container-low p-5 rounded-3xl border border-outline-variant/10">
                      <p className="text-[9px] uppercase text-on-surface-variant font-black tracking-widest mb-3 flex items-center gap-2">
                        <CreditCard size={12} /> Amount
                      </p>
                      <p className="text-sm font-black">৳ {(selectedOrder.amount || 0).toLocaleString()}</p>
                      <p className="text-[10px] text-on-surface-variant font-bold mt-1">Paid via Gateway</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-black text-on-surface-variant">System Logs</p>
                  <div className="relative pl-10 space-y-10">
                    <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-outline-variant/20" />
                    
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-secondary shadow-[0_0_15px_rgba(34,197,94,0.3)] ring-4 ring-surface-container-low" />
                      <p className="text-xs font-black uppercase">Verified</p>
                      <p className="text-[10px] text-on-surface-variant font-medium mt-1">Customer Check • 14:22:01</p>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-primary shadow-[0_0_15px_rgba(79,70,229,0.3)] ring-4 ring-surface-container-low" />
                      <p className="text-xs font-black uppercase">Fraud Check Done</p>
                      <p className="text-[10px] text-on-surface-variant font-medium mt-1">System Scan • 14:22:05</p>
                    </div>

                    <div className="relative">
                      <div className={cn(
                         "absolute -left-[31px] top-1 w-4 h-4 rounded-full ring-4 ring-surface-container-low",
                         selectedOrder.status === 'shipped' || selectedOrder.status === 'completed' ? "bg-secondary" : "bg-outline-variant animate-pulse"
                       )} />
                      <p className="text-xs font-black uppercase">Shipping</p>
                      <p className="text-[10px] text-on-surface-variant font-medium mt-1">Central Hub • Pending</p>
                    </div>
                  </div>
                </div>
              </div>

              {isManager && (
                <div className="p-8 bg-surface-container mt-auto border-t border-outline-variant/10 grid grid-cols-2 gap-4">
                  <button className="py-4 bg-surface-container-high rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary hover:bg-surface-container-highest transition-all border border-primary/10">Flag Order</button>
                  <button className="py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">Ship Order</button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
