import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Download, 
  Printer, 
  X, 
  ChevronRight, 
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Briefcase,
  Calendar,
  ShieldCheck,
  Send
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import api from '@/src/lib/api';
import { toast } from 'sonner';
import { Invoice } from '@/src/types';
import { useAuth } from '@/src/context/AuthContext';
import { PrintableInvoice } from '../components/invoices/PrintableInvoice';

export const Invoices: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager' || isAdmin;

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    status: '',
    dueDate: '',
    shippingCharge: 0
  });

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/invoices');
        setInvoices(response.data);
      } catch (err) {
        toast.error('Failed to load invoices from the database.');
        console.error('Invoices fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesFilter = activeFilter === 'all' || inv.status === activeFilter;
    const matchesSearch = (inv.id || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (inv.customer || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handlePrint = () => {
    if (!selectedInvoice) return;
    toast.info('Preparing invoice for printing...');
    window.print();
  };

  const handleSend = () => {
    if (!selectedInvoice) return;
    
    const promise = api.post(`/invoices/${selectedInvoice.id}/send`);
    
    toast.promise(promise, {
      loading: `Sending ${selectedInvoice.id} to ${selectedInvoice.email}...`,
      success: (res: any) => res.data.message || `Invoice successfully dispatched to ${selectedInvoice.customer}`,
      error: (err) => err.response?.data?.message || 'Failed to send invoice. Please verify mail server connection.',
    });
  };

  const handleUpdate = async () => {
    if (!selectedInvoice) return;
    
    try {
      const response = await api.put(`/invoices/${selectedInvoice.id}`, {
        status: editForm.status,
        due_at: editForm.dueDate,
        shipping_charge: editForm.shippingCharge
      });
      
      toast.success('Invoice updated successfully');
      setIsEditing(false);
      
      // Update local state
      const updatedInvoice = {
        ...selectedInvoice,
        status: editForm.status as any,
        dueDate: new Date(editForm.dueDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        shippingCharge: editForm.shippingCharge,
        total: selectedInvoice.amount + editForm.shippingCharge
      };
      
      setInvoices(invoices.map(inv => inv.id === selectedInvoice.id ? updatedInvoice : inv));
      setSelectedInvoice(updatedInvoice);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update invoice');
    }
  };

  const startEditing = () => {
    if (!selectedInvoice) return;
    
    // Convert M d, Y to YYYY-MM-DD for input[type="date"]
    const date = new Date(selectedInvoice.dueDate);
    const formattedDate = date.toISOString().split('T')[0];
    
    setEditForm({
      status: selectedInvoice.status,
      dueDate: formattedDate,
      shippingCharge: selectedInvoice.shippingCharge
    });
    setIsEditing(true);
  };

  const statusConfig = {
    paid: { icon: CheckCircle, color: 'text-secondary', bg: 'bg-secondary/10', label: 'Paid', border: 'border-secondary/20' },
    pending: { icon: Clock, color: 'text-tertiary', bg: 'bg-tertiary/10', label: 'Pending', border: 'border-tertiary/20' },
    overdue: { icon: AlertCircle, color: 'text-error', bg: 'bg-error/10', label: 'Overdue', border: 'border-error/20' },
  };

  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0);
  const totalPending = invoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.total, 0);
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.total, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-10"
    >
      <div className="no-print space-y-10">
      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Revenue Collected', value: totalPaid, color: 'secondary', icon: CheckCircle },
          { label: 'Outstanding Receivables', value: totalPending, color: 'tertiary', icon: Clock },
          { label: 'Risk Exposure (Overdue)', value: totalOverdue, color: 'error', icon: AlertCircle },
        ].map((stat, i) => (
          <div key={i} className={cn(
            "bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10 shadow-xl relative overflow-hidden group hover:bg-surface-container transition-all",
            `border-l-4 border-l-${stat.color}`
          )}>
            <div className={cn("absolute -top-6 -right-6 w-20 h-20 opacity-5 group-hover:scale-125 transition-transform", `text-${stat.color}`)}>
              <stat.icon size={80} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">{stat.label}</span>
            <div className="flex items-baseline gap-2 mt-4">
              <span className={cn("text-3xl font-black tracking-tighter", `text-${stat.color}`)}>
                {isAdmin || isManager ? `৳ ${(stat.value || 0).toLocaleString()}` : '৳ ••••••'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-wrap gap-2">
          {(['all', 'paid', 'pending', 'overdue'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                "px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all",
                activeFilter === f 
                  ? "bg-primary text-on-primary shadow-lg shadow-primary/20" 
                  : "bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-variant"
              )}
            >
              {f} ({f === 'all' ? invoices.length : invoices.filter(i => i.status === f).length})
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID or customer..."
            className="w-full bg-surface-container-low border border-outline-variant/10 rounded-2xl pl-12 pr-4 py-3.5 text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary/40 focus:bg-surface-container transition-all shadow-lg"
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-surface-container-low rounded-3xl border border-outline-variant/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-container-high/30 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">
                <th className="px-8 py-5">Invoice</th>
                <th className="px-6 py-5">Customer</th>
                <th className="px-6 py-5">Order ID</th>
                <th className="px-6 py-5">Amount</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredInvoices.map((invoice) => {
                const cfg = statusConfig[invoice.status];
                return (
                  <tr
                    key={invoice.id}
                    onClick={() => setSelectedInvoice(invoice)}
                    className="hover:bg-surface-container transition-all cursor-pointer group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                          <FileText size={20} className="text-primary" />
                        </div>
                        <span className="font-mono text-sm font-black text-primary tracking-tighter">{invoice.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <p className="text-sm font-black">{invoice.customer}</p>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">{invoice.email}</p>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        <Briefcase size={12} className="text-on-surface-variant" />
                        <span className="text-xs font-mono font-bold text-on-surface-variant">{invoice.orderId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 font-black text-on-surface tracking-tighter text-base">৳ {(invoice.total || 0).toLocaleString()}</td>
                    <td className="px-6 py-6">
                      <span className={cn(
                        "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5", 
                        (statusConfig[invoice.status] || statusConfig.pending).bg, 
                        (statusConfig[invoice.status] || statusConfig.pending).color, 
                        "border", 
                        (statusConfig[invoice.status] || statusConfig.pending).border
                      )}>
                        {React.createElement((statusConfig[invoice.status] || statusConfig.pending).icon, { size: 12, strokeWidth: 3 })}
                        {(statusConfig[invoice.status] || statusConfig.pending).label}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 hover:bg-surface-container-high rounded-full opacity-0 group-hover:opacity-100 transition-all">
                        <ChevronRight size={20} className="text-on-surface-variant" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredInvoices.length === 0 && (
          <div className="py-24 text-center">
            <FileText className="mx-auto mb-4 text-on-surface-variant/20" size={64} />
            <p className="text-on-surface-variant font-medium">No ledger entries matching your filters</p>
          </div>
        )}
      </div>

      {/* Invoice Intelligence Drawer */}
      <AnimatePresence>
        {selectedInvoice && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInvoice(null)}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-full max-w-lg bg-surface-container-low/95 backdrop-blur-3xl z-[110] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col border-l border-outline-variant/10"
            >
              <div className="p-6 flex items-center justify-between border-b border-outline-variant/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-lg shadow-primary/10">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h2 className="font-black text-xl tracking-tighter uppercase italic">Invoice</h2>
                    <p className="text-[10px] text-on-surface-variant font-black tracking-widest">{selectedInvoice.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => isEditing ? handleUpdate() : startEditing()}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all"
                  >
                    {isEditing ? 'Save' : 'Edit'}
                  </button>
                  <button onClick={() => { setSelectedInvoice(null); setIsEditing(false); }} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                {/* Invoice Header */}
                <div className="bg-surface-container p-8 rounded-3xl space-y-6 relative overflow-hidden border border-outline-variant/10">
                   <div className="absolute top-0 right-0 p-4">
                     <span className={cn(
                        "px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest",
                        (statusConfig[selectedInvoice.status] || statusConfig.pending).bg,
                        (statusConfig[selectedInvoice.status] || statusConfig.pending).color
                      )}>
                        {(statusConfig[selectedInvoice.status] || statusConfig.pending).label}
                      </span>
                   </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-black text-on-surface-variant">Customer Details</span>
                    <p className="text-2xl font-black mt-2 tracking-tighter text-on-surface">{selectedInvoice.customer}</p>
                    <p className="text-xs text-on-surface-variant font-bold mt-1 uppercase italic">{selectedInvoice.email}</p>
                  </div>
                  
                  {isEditing ? (
                    <div className="space-y-4 pt-4">
                      <div>
                        <label className="text-[10px] font-black uppercase text-on-surface-variant mb-2 block">Status</label>
                        <select 
                          value={editForm.status}
                          onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                          className="w-full bg-background border border-outline-variant/20 rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/40"
                        >
                          <option value="paid">Paid</option>
                          <option value="pending">Pending</option>
                          <option value="overdue">Overdue</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-on-surface-variant mb-2 block">Due Date</label>
                        <input 
                          type="date"
                          value={editForm.dueDate}
                          onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                          className="w-full bg-background border border-outline-variant/20 rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/40"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-on-surface-variant mb-2 block">Shipping Charge (৳)</label>
                        <input 
                          type="number"
                          value={editForm.shippingCharge}
                          onChange={(e) => setEditForm({ ...editForm, shippingCharge: Number(e.target.value) })}
                          className="w-full bg-background border border-outline-variant/20 rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/40"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-8 pt-6 border-t border-outline-variant/20">
                      <div>
                        <span className="text-[9px] uppercase tracking-[0.15em] text-on-surface-variant font-black flex items-center gap-2">
                          <Calendar size={12} className="text-primary" /> Invoice Date
                        </span>
                        <p className="text-sm font-black mt-1 uppercase tracking-tighter">{selectedInvoice.issuedDate}</p>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-[0.15em] text-on-surface-variant font-black flex items-center gap-2">
                          <Clock size={12} className="text-error" /> Due Date
                        </span>
                        <p className="text-sm font-black mt-1 uppercase tracking-tighter">{selectedInvoice.dueDate}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Line Items */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant pl-2">Invoice Items</p>
                  <div className="space-y-3">
                    {(Array.isArray(selectedInvoice.items) ? selectedInvoice.items : []).map((item, i) => (
                      <div key={i} className="flex justify-between items-center bg-surface-container-low p-5 rounded-2xl border border-outline-variant/10 hover:bg-surface-container transition-all">
                        <div className="flex-1">
                          <p className="text-sm font-black text-on-surface">{item.description}</p>
                          <p className="text-[10px] text-on-surface-variant font-bold mt-1 uppercase">Unit Price: ৳ {(item.unitPrice || 0).toLocaleString()} × {item.quantity}</p>
                        </div>
                        <span className={cn("font-black text-base tracking-tighter", item.total < 0 ? "text-secondary" : "text-primary")}>
                          {item.total < 0 ? '-' : ''}৳ {Math.abs(item.total || 0).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals Summary */}
                <div className="bg-surface-container-high rounded-3xl p-8 space-y-4 border border-outline-variant/10 shadow-xl">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                    <span className="text-on-surface-variant">Subtotal</span>
                    <span className="text-on-surface">৳ {(selectedInvoice.amount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                    <span className="text-on-surface-variant">Shipping Charge</span>
                    <span className="text-on-surface">৳ {(selectedInvoice.shippingCharge || 0).toLocaleString()}</span>
                  </div>
                  <div className="pt-6 border-t border-outline-variant/20">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">Total Amount</span>
                      <span className="text-4xl font-black text-primary tracking-tighter">৳ {(selectedInvoice.total || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secure Actions */}
              <div className="p-8 bg-surface-container mt-auto border-t border-outline-variant/10 grid grid-cols-2 gap-4">
                <button 
                  onClick={handlePrint}
                  className="py-4 bg-surface-container-high rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary hover:bg-surface-container-highest transition-all flex items-center justify-center gap-3 border border-primary/10"
                >
                  <Printer size={16} />
                  Print
                </button>
                <button 
                  onClick={handleSend}
                  className="py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <Send size={16} />
                  Send
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      </div>

      {/* Printable Template (Hidden until printing) */}
      {selectedInvoice && <PrintableInvoice invoice={selectedInvoice} />}
    </motion.div>
  );
};
