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
import { PrintableCustomerReport } from '../components/users/PrintableCustomerReport';
import { cn } from '@/src/lib/utils';

import api from '@/src/lib/api';
import { toast } from 'sonner';
import { Customer } from '@/src/types';
import { useAuth } from '@/src/context/AuthContext';

const getInitials = (name: string) => {
  if (!name) return '??';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

export const Users: React.FC = () => {
  const { user: authUser } = useAuth();
  const isAdmin = authUser?.role === 'admin';
  
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editForm, setEditForm] = React.useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    tier: '',
    fraudRiskScore: 0
  });

  React.useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/customers');
        setCustomers(response.data);
        if (response.data.length > 0 && !selectedId) {
          setSelectedId(response.data[0].id);
        }
      } catch (err) {
        toast.error('Failed to load customers from the database.');
        console.error('Customers fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Fetch full details when a customer is selected
  React.useEffect(() => {
    if (!selectedId) return;
    
    const fetchCustomerDetails = async () => {
      try {
        const response = await api.get(`/customers/${selectedId}`);
        const fullCustomer = response.data;
        
        // Update the specific customer in the list with full details (including orders)
        setCustomers(prev => prev.map(c => 
          c.id === selectedId 
            ? { ...c, orders: fullCustomer.orders } 
            : c
        ));
      } catch (err) {
        console.error('Failed to fetch customer details:', err);
      }
    };
    
    fetchCustomerDetails();
  }, [selectedId]);

  const handleUpdate = async () => {
    if (!selectedId) return;
    try {
      await api.put(`/customers/${selectedId}`, editForm);
      toast.success('Customer updated successfully');
      setIsEditing(false);
      
      // Update local state
      setCustomers(prev => prev.map(c => 
        c.id === selectedId ? { ...c, ...editForm } : c
      ));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update customer');
    }
  };

  const handleFlag = async () => {
    if (!selectedId || !selectedUser) return;
    const isFlagged = selectedUser.fraudRiskScore >= 90;
    const newScore = isFlagged ? 0 : 99;
    
    try {
      await api.put(`/customers/${selectedId}`, { fraudRiskScore: newScore });
      toast[isFlagged ? 'success' : 'warning'](
        isFlagged ? 'Review resolved: Risk level reset' : 'Customer has been flagged for high-risk review'
      );
      
      setCustomers(prev => prev.map(c => 
        c.id === selectedId ? { ...c, fraudRiskScore: newScore } : c
      ));
    } catch (err) {
      toast.error('Failed to update review status');
    }
  };

  const handleDownload = () => {
    if (!selectedUser) return;
    toast.success(`Generating comprehensive report for ${selectedUser.name}...`);
    setTimeout(() => {
      window.print();
    }, 1000);
  };

  const startEditing = () => {
    if (!selectedUser) return;
    setEditForm({
      name: selectedUser.name,
      email: selectedUser.email,
      phone: selectedUser.phone,
      location: selectedUser.location,
      tier: selectedUser.tier,
      fraudRiskScore: selectedUser.fraudRiskScore
    });
    setIsEditing(true);
  };

  const selectedUser = customers.find(u => u.id === selectedId) || null;
  
  const filteredCustomers = customers.filter(u => 
    (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (u.id || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full text-on-surface-variant space-y-4">
        <ShieldCheck size={64} className="opacity-20" />
        <p className="font-bold">No customers found in the system</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden">
      {/* Sidebar List */}
      <aside className="w-80 border-r border-outline-variant/10 bg-surface-container-low/30 flex flex-col no-print">
        <div className="p-6 border-b border-outline-variant/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-primary">Customers</h2>
            <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">{customers.length}</span>
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
                {getInitials(u.name)}
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
        {!selectedUser ? (
          <div className="flex flex-col items-center justify-center h-full text-on-surface-variant space-y-4 opacity-50">
            <Fingerprint size={64} className="animate-pulse" />
            <p className="font-black uppercase tracking-widest text-xs">Select a customer to decrypt profile</p>
          </div>
        ) : (
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
                    <span className="text-4xl font-black text-primary">{getInitials(selectedUser.name)}</span>
                  </div>
                  <div className="absolute -bottom-3 -right-3 bg-secondary text-on-secondary px-4 py-1.5 rounded-2xl text-[10px] font-black tracking-widest shadow-xl flex items-center gap-1.5 border-2 border-background">
                    <ShieldCheck size={12} />
                    VERIFIED
                  </div>
                </div>
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                    {isEditing ? (
                      <input 
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="text-4xl font-black tracking-tighter bg-surface-container border border-outline-variant/20 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    ) : (
                      <h1 className="text-4xl font-black tracking-tighter text-on-surface">{selectedUser.name}</h1>
                    )}
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border border-primary/20">
                      {selectedUser.tier}
                    </span>
                    {selectedUser.fraudRiskScore >= 90 && (
                      <span className="bg-error/10 text-error px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border border-error/20 animate-pulse">
                        FLAGGED
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-on-surface-variant font-bold text-sm tracking-wide justify-center md:justify-start">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={16} className="text-primary" /> 
                      {isEditing ? (
                        <input 
                          type="text"
                          value={editForm.location}
                          onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                          className="bg-surface-container border border-outline-variant/10 rounded-lg px-2 py-1 text-xs"
                        />
                      ) : selectedUser.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Mail size={16} className="text-primary" /> 
                      {isEditing ? (
                        <input 
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="bg-surface-container border border-outline-variant/10 rounded-lg px-2 py-1 text-xs"
                        />
                      ) : selectedUser.email}
                    </span>
                  </div>
                  <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start">
                    <span className="bg-surface-container-high px-3 py-1 rounded-md text-[10px] font-black tracking-widest uppercase text-on-surface-variant">ID: {selectedUser.id}</span>
                    <span className="bg-surface-container-high px-3 py-1 rounded-md text-[10px] font-black tracking-widest uppercase text-on-surface-variant">Joined {selectedUser.memberSince}</span>
                    {isEditing && (
                      <div className="flex items-center gap-2 bg-surface-container-high rounded-md px-3 py-1 border border-outline-variant/20">
                        <span className="text-[10px] font-black uppercase text-on-surface-variant">Risk:</span>
                        <input 
                          type="number"
                          min="0"
                          max="100"
                          value={editForm.fraudRiskScore}
                          onChange={(e) => setEditForm({ ...editForm, fraudRiskScore: Number(e.target.value) })}
                          className="bg-transparent text-[10px] font-black w-8 outline-none text-primary"
                        />
                      </div>
                    )}
                    {isEditing && (
                      <button 
                        onClick={handleUpdate}
                        className="bg-primary text-on-primary px-4 py-1 rounded-md text-[10px] font-black tracking-widest uppercase"
                      >
                        Save Changes
                      </button>
                    )}
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
                    <span className="text-3xl font-black text-secondary tracking-tighter">{selectedUser.fraudRiskScore}</span>
                    <div className="px-3 py-1 bg-secondary/10 text-secondary rounded-lg text-[10px] font-black uppercase tracking-widest">
                      {selectedUser.fraudRiskScore > 40 ? 'High' : selectedUser.fraudRiskScore > 20 ? 'Medium' : 'Minimal'}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Primary Actions */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 no-print">
              <button 
                onClick={() => document.getElementById('recent-orders')?.scrollIntoView({ behavior: 'smooth' })}
                className="group flex items-center justify-center gap-3 py-5 px-8 rounded-2xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-black uppercase tracking-[0.15em] text-xs shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <Eye size={18} />
                View Recent Activity
              </button>
              {isAdmin && (
                <>
                  <button 
                    onClick={() => isEditing ? setIsEditing(false) : startEditing()}
                    className="flex items-center justify-center gap-3 py-5 px-8 rounded-2xl bg-surface-container-low text-on-surface font-black uppercase tracking-[0.15em] text-xs border border-outline-variant/10 hover:bg-surface-container transition-all active:scale-95"
                  >
                    <Edit3 size={18} className="text-primary" />
                    {isEditing ? 'Cancel Editing' : 'Edit Information'}
                  </button>
                  <button 
                    onClick={handleFlag}
                    className={cn(
                      "flex items-center justify-center gap-3 py-5 px-8 rounded-2xl font-black uppercase tracking-[0.15em] text-xs border transition-all active:scale-95",
                      selectedUser.fraudRiskScore >= 90 
                        ? "bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20" 
                        : "bg-surface-container-low text-error border-error/20 hover:bg-error/5"
                    )}
                  >
                    <Flag size={18} fill={selectedUser.fraudRiskScore >= 90 ? "currentColor" : "none"} />
                    {selectedUser.fraudRiskScore >= 90 ? 'Resolve Review' : 'Flag for Review'}
                  </button>
                </>
              )}
            </section>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Order History */}
              <section id="recent-orders" className="lg:col-span-8 space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black tracking-tight text-on-surface uppercase italic">Recent Orders</h2>
                  <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-xl border border-outline-variant/10">
                    <ShoppingBag size={14} className="text-primary" />
                    <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{selectedUser.orders?.length || 0} Total Orders</span>
                  </div>
                </div>
                
                <div className="relative pl-10 space-y-8">
                  <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-outline-variant/10" />
                  
                  {selectedUser.orders && selectedUser.orders.length > 0 ? (
                    selectedUser.orders.map((order: any) => (
                      <div key={order.id} className="relative group">
                        <div className={cn(
                          "absolute -left-[31px] top-2 h-4 w-4 rounded-full flex items-center justify-center ring-8 ring-background shadow-xl z-10 transition-all group-hover:scale-125",
                          order.status === 'completed' || order.status === 'shipped' ? "bg-primary text-white" : "bg-surface-container-highest text-on-surface-variant border border-outline-variant/20"
                        )}>
                          {order.status === 'completed' ? <Check size={10} strokeWidth={4} /> : <Truck size={10} strokeWidth={4} />}
                        </div>
                        <div className={cn(
                          "bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10 transition-all hover:bg-surface-container hover:shadow-2xl hover:-translate-y-1 group-hover:border-primary/20",
                          order.status === 'processing' ? "border-l-8 border-l-primary" : "border-l-8 border-l-transparent"
                        )}>
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                            <span className="font-mono text-sm font-black text-primary tracking-tighter">Order ID {order.order_id}</span>
                            <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest bg-surface-container px-3 py-1 rounded-lg italic">
                              {new Date(order.order_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                          <div className="flex justify-between items-end">
                            <div className="space-y-1">
                              <p className="text-on-surface font-bold text-base">Bulk Order</p>
                              <div className={cn(
                                "text-[10px] font-black uppercase tracking-[0.2em] mt-2 inline-flex items-center gap-2",
                                order.status === 'completed' || order.status === 'shipped' ? "text-secondary" : order.status === 'cancelled' ? "text-error" : "text-on-surface-variant"
                              )}>
                                <div className="w-1 h-1 rounded-full bg-current" />
                                {order.status}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-black text-on-surface tracking-tighter">৳ {(order.total_amount || 0).toLocaleString()}</p>
                              <p className="text-[9px] font-bold text-on-surface-variant uppercase mt-1">Processed</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-on-surface-variant/40 italic text-sm">
                      No recent orders found for this customer.
                    </div>
                  )}
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
                  <button 
                    onClick={handleDownload}
                    className="w-full py-3 bg-primary text-on-primary rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                  >
                    Download Report
                  </button>
                </div>
              </section>
            </div>
          </motion.div>
        )}

        {/* Hidden Printable Report */}
        {selectedUser && <PrintableCustomerReport customer={selectedUser} />}
      </main>
    </div>
  );
};
