import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  Search, 
  CheckCircle, 
  ChevronRight, 
  X,
  MapPin,
  Activity,
  AlertTriangle,
  User,
  ExternalLink,
  ShieldCheck,
  Ban,
  Check
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useAuth } from '@/src/context/AuthContext';
import api from '@/src/lib/api';
import { toast } from 'sonner';

export const Alerts: React.FC = () => {
  const { user: authUser } = useAuth();
  const isAdmin = authUser?.role === 'admin';
  const isManager = authUser?.role === 'manager' || isAdmin;

  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [fraudEnabled, setFraudEnabled] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setIsLoading(true);
      const [alertsRes, settingsRes] = await Promise.all([
        api.get('/alerts'),
        api.get('/settings/all')
      ]);
      setAlerts(alertsRes.data);
      setFraudEnabled(settingsRes.data.fraud_enabled === '1' || settingsRes.data.fraud_enabled === true);
      
      if (alertsRes.data.length > 0 && !selectedId) {
        setSelectedId(alertsRes.data[0].id);
      }
    } catch (err) {
      toast.error('Failed to fetch security alerts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'allow' | 'block') => {
    try {
      const status = action === 'allow' ? 'processing' : 'cancelled';
      await api.put(`/orders/${id}`, { status });
      toast.success(action === 'allow' ? 'Order allowed and sent to processing' : 'Order blocked and cancelled');
      
      // Remove from alerts list
      setAlerts(prev => prev.filter(a => a.id !== id));
      if (selectedId === id) {
        setSelectedId(alerts.find(a => a.id !== id)?.id || null);
      }
    } catch (err) {
      toast.error('Failed to process security action');
    }
  };

  const selectedAlert = alerts.find(a => a.id === selectedId) || null;

  // Stats
  const highRiskCount = alerts.filter(a => a.fraudScore >= 80).length;
  const mediumRiskCount = alerts.filter(a => a.fraudScore >= 40 && a.fraudScore < 80).length;
  const avgScore = alerts.length > 0 
    ? Math.round(alerts.reduce((acc, curr) => acc + curr.fraudScore, 0) / alerts.length) 
    : 0;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 md:p-8 lg:p-12"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-error/10 flex items-center justify-center text-error border border-error/20">
              <ShieldAlert size={28} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-on-surface uppercase italic">Security Check</h1>
            <div className={cn(
              "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border",
              fraudEnabled ? "bg-secondary/10 text-secondary border-secondary/20" : "bg-error/10 text-error border-error/20 animate-pulse"
            )}>
              <div className="w-1.5 h-1.5 rounded-full bg-current" />
              Engine: {fraudEnabled ? 'Active' : 'Offline'}
            </div>
          </div>
          <p className="text-on-surface-variant max-w-xl font-medium">Live order monitoring via Security Matrix. {fraudEnabled ? 'Automated checks are operational.' : 'Manual review required - System is paused.'}</p>
        </div>
        <div className="flex gap-4 no-print">
          <button 
            onClick={() => window.print()}
            className="px-6 py-3 rounded-2xl bg-surface-container-high text-on-surface font-black uppercase tracking-widest text-[10px] border border-outline-variant/10 hover:bg-surface-container-highest transition-all shadow-lg"
          >
            Download Security Report
          </button>
          {isAdmin && alerts.length > 0 && (
            <button className="px-6 py-3 rounded-2xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/20 hover:brightness-110 transition-all">
              Approve All
            </button>
          )}
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {[
          { label: 'High Risk Orders', value: highRiskCount, color: 'border-error', icon: AlertTriangle, bg: 'bg-error/5' },
          { label: 'Orders to Check', value: mediumRiskCount, color: 'border-tertiary', icon: Activity, bg: 'bg-tertiary/5' },
          { label: 'System Safety', value: `${100 - avgScore}%`, color: 'border-secondary', icon: ShieldCheck, bg: 'bg-secondary/5' },
        ].map((stat) => (
          <div key={stat.label} className={cn("bg-surface-container rounded-[2rem] p-8 flex flex-col justify-between border border-outline-variant/10 shadow-xl relative overflow-hidden group", stat.bg)}>
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform">
               <stat.icon size={64} />
             </div>
             <span className="text-on-surface-variant text-[10px] font-black uppercase tracking-[0.2em] relative z-10">{stat.label}</span>
             <div className="flex items-baseline gap-3 mt-6 relative z-10">
               <span className="text-4xl font-black text-on-surface tracking-tighter">{stat.value}</span>
               <div className={cn("w-2 h-2 rounded-full", stat.color.replace('border-', 'bg-'))} />
             </div>
          </div>
        ))}
      </section>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-black text-on-surface tracking-tight uppercase italic flex items-center gap-2">
              Waiting for Review
              <span className="text-[10px] not-italic bg-error/10 text-error px-2 py-1 rounded-lg border border-error/20 ml-2">
                {alerts.length} Pending
              </span>
            </h2>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-24 w-full bg-surface-container animate-pulse rounded-2xl border border-outline-variant/10" />
              ))
            ) : alerts.length === 0 ? (
              <div className="p-20 text-center bg-surface-container-low border-2 border-dashed border-outline-variant/20 rounded-[3rem] shadow-inner">
                <div className="w-20 h-20 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-secondary/20 shadow-2xl shadow-secondary/20">
                  <ShieldCheck size={40} />
                </div>
                <h3 className="text-2xl font-black mb-2 text-on-surface uppercase tracking-tight">System Secure</h3>
                <p className="text-sm text-on-surface-variant font-medium">All orders are safe. No suspicious activity found.</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div 
                  key={alert.id}
                  onClick={() => setSelectedId(alert.id)}
                  className={cn(
                    "bg-surface-container hover:bg-surface-container-high transition-all rounded-[2rem] p-6 cursor-pointer flex items-center gap-6 group border border-outline-variant/10 relative overflow-hidden",
                    selectedId === alert.id && "ring-2 ring-primary bg-surface-container-high shadow-2xl shadow-primary/10"
                  )}
                >
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg transition-transform group-hover:scale-110",
                    alert.fraudScore >= 80 ? "bg-error/10 text-error border-error/20" : "bg-tertiary/10 text-tertiary border-tertiary/20"
                  )}>
                    {alert.fraudScore >= 80 ? <ShieldAlert size={28} /> : <AlertTriangle size={28} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-black text-on-surface tracking-tight uppercase">{alert.customer}</h3>
                      <span className={cn(
                        "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
                        alert.fraudScore >= 80 ? "bg-error/10 text-error border-error/20" : "bg-tertiary/10 text-tertiary border-tertiary/20"
                      )}>
                        {alert.fraudScore >= 80 ? 'High Risk' : 'Low Risk'}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1 font-mono">{alert.id} • {alert.email}</p>
                  </div>
                  <div className="hidden md:flex flex-col items-end gap-1 px-6 border-x border-outline-variant/10">
                    <span className={cn(
                      "text-3xl font-black tracking-tighter",
                      alert.fraudScore >= 80 ? "text-error" : "text-tertiary"
                    )}>{alert.fraudScore}</span>
                    <span className="text-[9px] text-on-surface-variant uppercase font-black tracking-[0.2em]">Risk Index</span>
                  </div>
                  <div className="pl-2">
                    <ChevronRight className="text-on-surface-variant group-hover:text-primary transition-colors group-hover:translate-x-1" size={24} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {selectedAlert && (
            <motion.aside 
              key={selectedAlert.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full lg:w-[480px] bg-surface-container rounded-[3rem] border border-outline-variant/10 p-10 shadow-2xl relative overflow-hidden h-fit"
            >
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-error/5 blur-3xl rounded-full" />
              
              <div className="flex items-center justify-between mb-10 relative z-10">
                <h3 className="text-2xl font-black text-on-surface tracking-tight uppercase italic">Order Details</h3>
                <button onClick={() => setSelectedId(null)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                  <X className="text-on-surface-variant" size={24} />
                </button>
              </div>

              <div className="space-y-8 relative z-10">
                <div className="flex items-center gap-6 p-6 rounded-[2rem] bg-background/40 border border-outline-variant/10 shadow-inner">
                  <div className={cn(
                    "w-24 h-24 rounded-3xl flex flex-col items-center justify-center border-2 shadow-2xl",
                    selectedAlert.fraudScore >= 80 ? "bg-error/10 text-error border-error/20" : "bg-tertiary/10 text-tertiary border-tertiary/20"
                  )}>
                    <span className="text-4xl font-black tracking-tighter">{selectedAlert.fraudScore}</span>
                    <span className="text-[8px] font-black uppercase tracking-widest mt-1 opacity-60">Risk Score</span>
                  </div>
                  <div>
                    <h4 className={cn(
                      "font-black text-xl tracking-tight uppercase mb-1",
                      selectedAlert.fraudScore >= 80 ? "text-error" : "text-tertiary"
                    )}>
                      {selectedAlert.fraudScore >= 80 ? 'High Risk Order' : 'Review Suggested'}
                    </h4>
                    <p className="text-sm text-on-surface-variant font-medium leading-tight">
                      Please check this order manually. We recommend verifying the customer's phone and address.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant border-b border-outline-variant/20 pb-3">Safety Reasons</p>
                  {[
                    { label: 'Customer History', value: selectedAlert.fraudScore >= 80 ? 'New User' : 'Normal', icon: User },
                    { label: 'Order Frequency', value: selectedAlert.fraudScore >= 80 ? 'Too Fast' : 'Normal', icon: Activity },
                    { label: 'Order Total', value: `৳ ${selectedAlert.amount.toLocaleString()}`, icon: ShieldAlert },
                    { label: 'Device Check', value: 'Safe', icon: ShieldCheck },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center p-4 bg-surface-container-high rounded-2xl border border-outline-variant/5">
                      <div className="flex items-center gap-3">
                        <div className="text-primary/60"><item.icon size={16} /></div>
                        <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">{item.label}</span>
                      </div>
                      <span className={cn(
                        "text-xs font-black uppercase tracking-widest",
                        item.value === 'Suspicious' || item.value === 'Low' ? 'text-error' : 'text-on-surface'
                      )}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="h-48 w-full rounded-[2rem] bg-surface-container-highest overflow-hidden relative shadow-inner group">
                  <img 
                    className="w-full h-full object-cover opacity-30 grayscale group-hover:scale-110 transition-transform duration-700" 
                    src={`https://api.dicebear.com/7.x/identicon/svg?seed=${selectedAlert.id}`} 
                    alt="Digital Fingerprint"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-high via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-error text-on-error px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl">
                      <MapPin size={14} />
                      Target Location
                    </div>
                    <div className="bg-surface-container/90 backdrop-blur px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-on-surface border border-outline-variant/10">
                      IP: 192.168.1.*
                    </div>
                  </div>
                </div>

                {isManager && (
                  <div className="pt-4 grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => handleAction(selectedAlert.id, 'allow')}
                      className="group flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border border-secondary/30 text-secondary font-black uppercase tracking-widest text-[10px] hover:bg-secondary/10 transition-all shadow-lg active:scale-95"
                    >
                      <Check size={16} className="group-hover:scale-125 transition-transform" />
                      Approve Order
                    </button>
                    <button 
                      onClick={() => handleAction(selectedAlert.id, 'block')}
                      className="group flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-error text-on-error font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-error/20 hover:brightness-110 transition-all active:scale-95"
                    >
                      <Ban size={16} className="group-hover:scale-125 transition-transform" />
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
