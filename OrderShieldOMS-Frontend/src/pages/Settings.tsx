import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Key, 
  Link as LinkIcon, 
  Eye, 
  Save, 
  Activity, 
  Truck,
  ShieldCheck,
  CheckCircle,
  Plus,
  Trash2,
  Edit2,
  Globe,
  Settings as SettingsIcon,
  Database,
  Loader2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useAuth } from '@/src/context/AuthContext';
import api from '@/src/lib/api';
import { toast } from 'sonner';

interface SettingsProps {
  activeTab?: 'courier' | 'fraud' | 'webhook';
}

export const Settings: React.FC<SettingsProps> = ({ activeTab = 'courier' }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [couriers, setCouriers] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({
    fraud_api_key: '',
    fraud_api_url: '',
    fraud_enabled: '1',
    webhook_key: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // New courier form state
  const [newCourier, setNewCourier] = useState({
    name: 'Steadfast Courier',
    api_url: '',
    api_key: '',
    secret_key: '',
  });

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [couriersRes, settingsRes] = await Promise.all([
        api.get('/couriers'),
        api.get('/settings/all')
      ]);
      setCouriers(couriersRes.data);
      setSettings(prev => ({ ...prev, ...settingsRes.data }));
    } catch (err) {
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await api.post('/settings/bulk', settings);
      toast.success('System settings updated');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCourier = async () => {
    try {
      setIsSaving(true);
      const response = await api.post('/couriers', newCourier);
      setCouriers([...couriers, response.data]);
      setNewCourier({
        name: 'Steadfast Courier',
        api_url: '',
        api_key: '',
        secret_key: '',
      });
      toast.success('Courier added successfully');
    } catch (err) {
      toast.error('Failed to add courier');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCourier = async (id: number) => {
    try {
      await api.delete(`/couriers/${id}`);
      setCouriers(couriers.filter(c => c.id !== id));
      toast.success('Courier removed');
    } catch (err) {
      toast.error('Failed to remove courier');
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-error/10 flex items-center justify-center text-error">
          <ShieldCheck size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black uppercase tracking-tighter">Access Restricted</h2>
          <p className="text-on-surface-variant max-w-sm text-sm font-medium">
            You do not have the necessary security clearance to modify system-level configurations. Please contact your senior administrator.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-6 py-8"
    >
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <SettingsIcon size={24} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-on-surface uppercase italic tracking-tighter">
            {activeTab === 'courier' && 'Courier Services'}
            {activeTab === 'fraud' && 'Security Configuration'}
            {activeTab === 'webhook' && 'Automatic Notifications'}
          </h2>
        </div>
        <p className="text-on-surface-variant max-w-xl text-sm font-medium">
          {activeTab === 'courier' && 'Connect OrderShield to your delivery partners.'}
          {activeTab === 'fraud' && 'Configure security keys for live fraud detection.'}
          {activeTab === 'webhook' && 'Manage automatic data updates and courier webhooks.'}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        
        {activeTab === 'fraud' && (
        <section className="bg-surface-container rounded-[2rem] overflow-hidden border border-outline-variant/10 shadow-xl">
          <div className="bg-surface-container-high/50 px-8 py-5 border-b border-outline-variant/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-primary" size={20} />
              <h3 className="text-on-surface font-black uppercase tracking-tight italic">Fraud Checking</h3>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
              <div className={cn("w-1.5 h-1.5 rounded-full bg-primary", settings.fraud_enabled === '1' && "animate-pulse")} />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                {settings.fraud_enabled === '1' ? 'Protected' : 'Standby'}
              </span>
            </div>
          </div>
          
          <div className="p-10">
            <form onSubmit={handleSaveSettings} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant block ml-1">Security Key *</label>
                  <div className="relative group">
                    <input 
                      type="password" 
                      className="w-full bg-surface-container-low border border-outline-variant/10 rounded-xl px-4 py-4 text-sm text-on-surface focus:ring-2 focus:ring-primary/40 transition-all font-mono"
                      value={settings.fraud_api_key || ''}
                      onChange={(e) => setSettings({ ...settings, fraud_api_key: e.target.value })}
                      placeholder="Enter security key"
                    />
                    <Key className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/30 group-focus-within:text-primary transition-colors" size={18} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant block ml-1">API Endpoint *</label>
                  <div className="relative group">
                    <input 
                      type="text" 
                      className="w-full bg-surface-container-low border border-outline-variant/10 rounded-xl px-4 py-4 text-sm text-on-surface focus:ring-2 focus:ring-primary/40 transition-all"
                      value={settings.fraud_api_url || ''}
                      onChange={(e) => setSettings({ ...settings, fraud_api_url: e.target.value })}
                      placeholder="https://api.security-service.com/check"
                    />
                    <Globe className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/30 group-focus-within:text-primary transition-colors" size={18} />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-surface-container-low w-fit px-5 py-3 rounded-2xl border border-outline-variant/10 shadow-sm">
                <div className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    id="isActive" 
                    className="sr-only peer" 
                    checked={settings.fraud_enabled === '1'} 
                    onChange={(e) => setSettings({ ...settings, fraud_enabled: e.target.checked ? '1' : '0' })}
                  />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </div>
                <label htmlFor="isActive" className="text-xs font-black uppercase tracking-widest text-on-surface-variant cursor-pointer select-none">
                  Enable Live Monitoring
                </label>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="bg-primary hover:bg-primary/90 text-on-primary px-10 py-4 rounded-xl text-sm font-black transition-all shadow-xl shadow-primary/20 active:scale-[0.98] uppercase tracking-widest flex items-center gap-2"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  Save and Connect
                </button>
              </div>
            </form>
          </div>
        </section>
        )}

        {activeTab === 'courier' && (
        <div className="space-y-8">
          <section className="bg-surface-container rounded-[2rem] overflow-hidden border border-outline-variant/10 shadow-xl">
            <div className="bg-surface-container-high/50 px-8 py-5 border-b border-outline-variant/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Truck className="text-secondary" size={20} />
                <h3 className="text-on-surface font-black uppercase tracking-tight italic">Registered Couriers</h3>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {couriers.map((courier) => (
                  <div key={courier.id} className="bg-surface-container-low border border-outline-variant/10 rounded-3xl p-6 relative group hover:shadow-2xl hover:shadow-secondary/5 transition-all">
                    <button 
                      onClick={() => handleDeleteCourier(courier.id)}
                      className="absolute top-4 right-4 p-2 text-on-surface-variant/40 hover:text-error transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-4 border border-secondary/20">
                      <Truck size={24} />
                    </div>
                    <h4 className="font-black text-on-surface uppercase tracking-tight mb-1">{courier.name}</h4>
                    <p className="text-[10px] text-on-surface-variant font-mono truncate mb-4">{courier.api_url}</p>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "w-2 h-2 rounded-full",
                        courier.is_active ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-on-surface-variant/30"
                      )} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                        {courier.is_active ? 'Active' : 'Offline'}
                      </span>
                    </div>
                  </div>
                ))}
                
                {couriers.length === 0 && (
                  <div className="col-span-full py-12 text-center border-2 border-dashed border-outline-variant/10 rounded-[2rem]">
                    <p className="text-sm font-medium text-on-surface-variant italic">No courier partners connected yet.</p>
                  </div>
                )}
              </div>

              <div className="bg-surface-container-high/30 rounded-[2rem] p-10 border border-outline-variant/10">
                <h4 className="text-xl font-black text-on-surface uppercase tracking-tight italic mb-8 flex items-center gap-2">
                  <Plus className="text-secondary" size={24} />
                  Add New Integration
                </h4>
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant block ml-1">Courier Provider</label>
                      <select 
                        className="w-full bg-surface-container-low border border-outline-variant/10 rounded-xl px-4 py-4 text-sm text-on-surface focus:ring-2 focus:ring-secondary/40 transition-all appearance-none outline-none"
                        value={newCourier.name}
                        onChange={(e) => setNewCourier({ ...newCourier, name: e.target.value })}
                      >
                        <option>Steadfast Courier</option>
                        <option>Pathao Logistics</option>
                        <option>RedX Delivery</option>
                        <option>Paperfly</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant block ml-1">Provider API Link</label>
                      <input 
                        type="text" 
                        placeholder="https://api.steadfast.com.bd/v1"
                        className="w-full bg-surface-container-low border border-outline-variant/10 rounded-xl px-4 py-4 text-sm text-on-surface focus:ring-2 focus:ring-secondary/40 transition-all"
                        value={newCourier.api_url}
                        onChange={(e) => setNewCourier({ ...newCourier, api_url: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant block ml-1">API Key</label>
                      <input 
                        type="password" 
                        placeholder="Enter API Key"
                        className="w-full bg-surface-container-low border border-outline-variant/10 rounded-xl px-4 py-4 text-sm text-on-surface focus:ring-2 focus:ring-secondary/40 transition-all font-mono"
                        value={newCourier.api_key}
                        onChange={(e) => setNewCourier({ ...newCourier, api_key: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant block ml-1">Secret Key / Token</label>
                      <input 
                        type="password" 
                        placeholder="Enter Secret Key"
                        className="w-full bg-surface-container-low border border-outline-variant/10 rounded-xl px-4 py-4 text-sm text-on-surface focus:ring-2 focus:ring-secondary/40 transition-all font-mono"
                        value={newCourier.secret_key}
                        onChange={(e) => setNewCourier({ ...newCourier, secret_key: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button 
                      onClick={handleAddCourier}
                      disabled={isSaving || !newCourier.api_url}
                      className="bg-secondary hover:bg-secondary/90 text-on-secondary px-10 py-4 rounded-xl text-sm font-black transition-all shadow-xl shadow-secondary/20 active:scale-[0.98] uppercase tracking-widest flex items-center gap-2"
                    >
                      {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                      Authorize and Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        )}

        {activeTab === 'webhook' && (
        <div className="space-y-8">
          <section className="bg-surface-container rounded-[2rem] overflow-hidden border border-outline-variant/10 shadow-xl">
            <div className="bg-surface-container-high/50 px-8 py-5 border-b border-outline-variant/10">
              <div className="flex items-center gap-3">
                <Activity className="text-tertiary" size={20} />
                <h3 className="text-on-surface font-black uppercase tracking-tight italic">Notification Webhooks</h3>
              </div>
            </div>
            
            <div className="p-10">
              <div className="bg-tertiary/5 border border-tertiary/10 rounded-3xl p-8 mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-tertiary/10 flex items-center justify-center text-tertiary border border-tertiary/20">
                    <Activity size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-on-surface uppercase tracking-tight mb-2">Automated Data Sync</h4>
                    <p className="text-sm text-on-surface-variant max-w-2xl font-medium leading-relaxed">
                      Use this unique key to receive automatic delivery updates from your courier partners. 
                      Configure your courier panel to send status updates to: 
                      <code className="bg-surface-container-highest px-2 py-1 rounded text-primary ml-1 lowercase">https://oms.ordershield.com/api/webhooks/updates</code>
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant block ml-1">Your Webhook Secret</label>
                  <div className="relative group">
                    <input 
                      type="text" 
                      readOnly
                      className="w-full bg-surface-container-low border border-outline-variant/10 rounded-xl px-4 py-4 text-sm text-on-surface font-mono"
                      value={settings.webhook_key || 'os_live_key_7x29B'}
                    />
                    <Key className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/30" size={18} />
                  </div>
                </div>
                <button 
                  onClick={async () => {
                    const newKey = 'os_live_' + Math.random().toString(36).substring(7);
                    setSettings({ ...settings, webhook_key: newKey });
                    await api.post('/settings/bulk', { webhook_key: newKey });
                    toast.success('New Security Key Generated');
                  }}
                  className="bg-tertiary hover:bg-tertiary/90 text-on-tertiary px-8 py-4 rounded-xl text-sm font-black transition-all shadow-xl shadow-tertiary/20 active:scale-[0.98] uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Activity size={18} />
                  Generate New Key
                </button>
              </div>
            </div>
          </section>
        </div>
        )}

      </div>
    </motion.div>
  );
};
