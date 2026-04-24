import React from 'react';
import { motion } from 'motion/react';
import { 
  Search,
  MapPin, 
  Check, 
  Eye, 
  Edit3, 
  Flag, 
  Fingerprint, 
  Smartphone, 
  CreditCard, 
  Home,
  Clock,
  Truck,
  History,
  ShieldCheck,
  Star,
  ShoppingBag,
  Mail
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

import { useAuth } from '@/src/context/AuthContext';


const mockCustomers = [
  {
    id: 'USR-8849-XT',
    name: 'Shihab Shoron',
    initials: 'SS',
    location: 'Dhanmondi, Dhaka 1209',
    email: 'shihab@ordershield.com',
    phone: '+880 1711-223344',
    lifetimeValue: 48250.00,
    fraudRisk: 12,
    tier: 'Platinum Tier',
    memberSince: 'Mar 2026',
    avatar: 'https://i.pravatar.cc/150?u=shihab',
    orders: [
      { id: 'ORD-88219', date: 'Oct 24, 2026 • 14:20', name: 'Tin Goyenda: Collector\'s Edition', status: 'Delivered', amount: '৳ 2,499.00', icon: Check, active: true },
      { id: 'ORD-88112', date: 'Sep 12, 2026 • 09:12', name: 'The Alchemist: 25th Anniversary Edition', status: 'Completed', amount: '৳ 1,120.50', icon: Truck, active: false },
    ]
  },
  {
    id: 'USR-9021-QA',
    name: 'Aayan Rahman',
    initials: 'AR',
    location: 'Gulshan 2, Dhaka 1212',
    email: 'aayan@ordershield.com',
    phone: '+880 1812-334455',
    lifetimeValue: 12500.00,
    fraudRisk: 5,
    tier: 'Gold Tier',
    memberSince: 'Jan 2024',
    avatar: 'https://i.pravatar.cc/150?u=aayan',
    orders: [
      { id: 'ORD-90210', date: 'Oct 25, 2026 • 10:15', name: 'Sapiens: A Brief History of Humankind', status: 'Delivered', amount: '৳ 1,600.00', icon: Check, active: true },
    ]
  },
  {
    id: 'USR-1156-BK',
    name: 'Fatima Ahmed',
    initials: 'FA',
    location: 'Uttara, Dhaka 1230',
    email: 'fatima@ordershield.com',
    phone: '+880 1913-445566',
    lifetimeValue: 67000.00,
    fraudRisk: 45,
    tier: 'Diamond Tier',
    memberSince: 'Jun 2023',
    avatar: 'https://i.pravatar.cc/150?u=fatima',
    orders: [
      { id: 'ORD-11561', date: 'Aug 12, 2026 • 15:30', name: 'Atomic Habits: Tiny Changes, Remarkable Results', status: 'Cancelled', amount: '৳ 840.00', icon: History, active: false },
    ]
  }
];

export const Users: React.FC = () => {
  const { user: authUser } = useAuth();
  const isAdmin = authUser?.role === 'admin';
  const [selectedId, setSelectedId] = React.useState(mockCustomers[0].id);
  const [searchQuery, setSearchQuery] = React.useState('');

  const selectedUser = mockCustomers.find(u => u.id === selectedId) || mockCustomers[0];
  const filteredCustomers = mockCustomers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden">
      {/* Sidebar List */}
      <aside className="w-80 border-r border-outline-variant/10 bg-surface-container-low/30 flex flex-col">
        <div className="p-6 border-b border-outline-variant/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-primary">Customers</h2>
            <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">{mockCustomers.length}</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" size={14} />
            <input 
              type="text"
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-high border-none rounded-xl pl-9 pr-4 py-2.5 text-xs text-on-surface focus:ring-1 focus:ring-primary/40 transition-all"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredCustomers.map((u) => (
            <button
              key={u.id}
              onClick={() => setSelectedId(u.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-2xl transition-all group",
                selectedId === u.id 
                  ? "bg-primary text-on-primary shadow-lg shadow-primary/20" 
                  : "hover:bg-surface-container text-on-surface-variant hover:text-on-surface"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-colors",
                selectedId === u.id ? "bg-white/20" : "bg-primary/10 text-primary group-hover:bg-primary/20"
              )}>
                {u.initials}
              </div>
              <div className="text-left overflow-hidden">
                <p className="text-sm font-bold truncate">{u.name}</p>
                <p className={cn(
                  "text-[10px] font-medium uppercase tracking-wider truncate",
                  selectedId === u.id ? "text-on-primary/70" : "text-on-surface-variant/60"
                )}>{u.id}</p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Detail View */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <motion.div 
          key={selectedId}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-6xl mx-auto p-6 lg:p-10 space-y-12 pb-32"
        >
          {/* Profile Header */}
          <section className="flex flex-col lg:flex-row gap-10 items-start lg:items-center justify-between">
            <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="relative group">
                <div className="h-32 w-32 rounded-3xl overflow-hidden bg-primary/10 ring-4 ring-primary/20 shadow-2xl flex items-center justify-center border border-primary/30">
                  <span className="text-4xl font-black text-primary">{selectedUser.initials}</span>
                </div>
                <div className="absolute -bottom-3 -right-3 bg-secondary text-on-secondary px-4 py-1.5 rounded-2xl text-[10px] font-black tracking-widest shadow-xl flex items-center gap-1.5 border-2 border-background">
                  <ShieldCheck size={12} />
                  VERIFIED
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                  <h1 className="text-4xl font-black tracking-tighter text-on-surface">{selectedUser.name}</h1>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border border-primary/20">
                    {selectedUser.tier}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-on-surface-variant font-bold text-sm tracking-wide justify-center md:justify-start">
                  <span className="flex items-center gap-1.5"><MapPin size={16} className="text-primary" /> {selectedUser.location}</span>
                  <span className="flex items-center gap-1.5"><Mail size={16} className="text-primary" /> {selectedUser.email}</span>
                </div>
                <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="bg-surface-container-high px-3 py-1 rounded-md text-[10px] font-black tracking-widest uppercase text-on-surface-variant">ID: {selectedUser.id}</span>
                  <span className="bg-surface-container-high px-3 py-1 rounded-md text-[10px] font-black tracking-widest uppercase text-on-surface-variant">Joined {selectedUser.memberSince}</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-auto grid grid-cols-2 lg:flex lg:flex-col gap-4">
              <div className="bg-surface-container-low p-6 rounded-3xl flex flex-col items-center justify-center text-center border border-outline-variant/10 shadow-xl min-w-[200px]">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2">Total Spent</span>
                <span className="text-3xl font-black text-primary tracking-tighter">৳ {(selectedUser.lifetimeValue || 0).toLocaleString()}</span>
              </div>
              <div className="bg-surface-container-low p-6 rounded-3xl flex flex-col items-center justify-center text-center border border-outline-variant/10 shadow-xl border-b-4 border-b-secondary/50">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2">Fraud Risk Score</span>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-secondary tracking-tighter">{selectedUser.fraudRisk}</span>
                  <div className="px-3 py-1 bg-secondary/10 text-secondary rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {selectedUser.fraudRisk > 40 ? 'High' : selectedUser.fraudRisk > 20 ? 'Medium' : 'Minimal'}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Primary Actions */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button className="group flex items-center justify-center gap-3 py-5 px-8 rounded-2xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-black uppercase tracking-[0.15em] text-xs shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
              <Eye size={18} />
              View Recent Activity
            </button>
            {isAdmin && (
              <>
                <button className="flex items-center justify-center gap-3 py-5 px-8 rounded-2xl bg-surface-container-low text-on-surface font-black uppercase tracking-[0.15em] text-xs border border-outline-variant/10 hover:bg-surface-container transition-all active:scale-95">
                  <Edit3 size={18} className="text-primary" />
                  Edit Information
                </button>
                <button className="flex items-center justify-center gap-3 py-5 px-8 rounded-2xl bg-surface-container-low text-error font-black uppercase tracking-[0.15em] text-xs border border-error/20 hover:bg-error/5 transition-all active:scale-95">
                  <Flag size={18} />
                  Flag for Review
                </button>
              </>
            )}
          </section>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Order History */}
            <section className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black tracking-tight text-on-surface uppercase italic">Recent Orders</h2>
                <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-xl border border-outline-variant/10">
                  <ShoppingBag size={14} className="text-primary" />
                  <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{selectedUser.orders.length} Total Orders</span>
                </div>
              </div>
              
              <div className="relative pl-10 space-y-8">
                <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-outline-variant/10" />
                
                {selectedUser.orders.map((order) => (
                  <div key={order.id} className="relative group">
                    <div className={cn(
                      "absolute -left-[31px] top-2 h-4 w-4 rounded-full flex items-center justify-center ring-8 ring-background shadow-xl z-10 transition-all group-hover:scale-125",
                      order.active ? "bg-primary text-white" : "bg-surface-container-highest text-on-surface-variant border border-outline-variant/20"
                    )}>
                      <order.icon size={10} strokeWidth={4} />
                    </div>
                    <div className={cn(
                      "bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10 transition-all hover:bg-surface-container hover:shadow-2xl hover:-translate-y-1 group-hover:border-primary/20",
                      order.active ? "border-l-8 border-l-primary" : "border-l-8 border-l-transparent"
                    )}>
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                        <span className="font-mono text-sm font-black text-primary tracking-tighter">Order ID {order.id}</span>
                        <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest bg-surface-container px-3 py-1 rounded-lg italic">{order.date}</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <p className="text-on-surface font-bold text-base">{order.name}</p>
                          <div className={cn(
                            "text-[10px] font-black uppercase tracking-[0.2em] mt-2 inline-flex items-center gap-2",
                            order.status === 'Delivered' ? "text-secondary" : order.status === 'Cancelled' ? "text-error" : "text-on-surface-variant"
                          )}>
                            <div className="w-1 h-1 rounded-full bg-current" />
                            {order.status}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-on-surface tracking-tighter">{order.amount}</p>
                          <p className="text-[9px] font-bold text-on-surface-variant uppercase mt-1">Processed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Information Sidebar */}
            <section className="lg:col-span-4 space-y-6">
              <div className="bg-surface-container p-8 rounded-3xl border border-outline-variant/10 space-y-6 shadow-xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/5 blur-3xl rounded-full" />
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">Customer Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary">
                      <Smartphone size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-on-surface-variant tracking-widest mb-0.5">Primary Device</p>
                      <p className="text-sm font-bold">iPhone 15 Pro Max</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-secondary">
                      <Fingerprint size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-on-surface-variant tracking-widest mb-0.5">Security Level</p>
                      <p className="text-sm font-bold">High Trust Level</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-tertiary">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-on-surface-variant tracking-widest mb-0.5">Payment Method</p>
                      <p className="text-sm font-bold">VISA •••• 8821</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-outline-variant/10">
                  <div className="bg-surface-container-highest/30 p-4 rounded-2xl border border-outline-variant/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Star size={14} className="text-tertiary fill-tertiary" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">Admin Note</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed font-medium">
                      This customer has been consistently reliable. No issues found in recent orders.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary/20 to-primary-container/20 p-8 rounded-3xl border border-primary/20 shadow-xl">
                 <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck size={24} className="text-primary" />
                    <h4 className="font-black text-sm uppercase tracking-tight">Account Status</h4>
                 </div>
                 <p className="text-xs text-on-surface-variant font-medium leading-relaxed mb-6">
                    This account is currently in good standing. Security checks are active.
                 </p>
                 <button className="w-full py-3 bg-primary text-on-primary rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                    Download Report
                 </button>
              </div>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
};
