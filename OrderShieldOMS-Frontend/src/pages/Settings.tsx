import React, { useState } from 'react';
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
  Database
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useAuth } from '@/src/context/AuthContext';

interface SettingsProps {
  activeTab?: 'courier' | 'fraud' | 'webhook';
}



export const Settings: React.FC<SettingsProps> = ({ activeTab = 'courier' }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

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
          <h2 className="text-3xl font-bold tracking-tight text-on-surface">
            {activeTab === 'courier' && 'Courier Services'}
            {activeTab === 'fraud' && 'Fraud Checking'}
            {activeTab === 'webhook' && 'Automatic Notifications'}
          </h2>
        </div>
        <p className="text-on-surface-variant max-w-xl text-sm">
          Connect OrderShield to your delivery partners and security services.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        
        {activeTab === 'fraud' && (
        <section className="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/10 shadow-sm">
          <div className="bg-surface-container-high/50 px-8 py-5 border-b border-outline-variant/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-primary" size={20} />
              <h3 className="text-on-surface font-bold">Fraud Checking</h3>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Protected</span>
            </div>
          </div>
          
          <div className="p-8">
            <p className="text-xs text-on-surface-variant/70 italic mb-8 flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-error" />
              Required fields are marked with an asterisk (*)
            </p>

            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant block ml-1">Security Key *</label>
                  <div className="relative group">
                    <input 
                      type="password" 
                      className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 text-sm text-on-surface focus:ring-2 focus:ring-primary/40 transition-all font-mono"
                      defaultValue="EPtgOKSTYxRCQ5sBABtGHi"
                    />
                    <Key className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/30 group-focus-within:text-primary transition-colors" size={18} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant block ml-1">API Link *</label>
                  <div className="relative group">
                    <input 
                      type="text" 
                      className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 text-sm text-on-surface focus:ring-2 focus:ring-primary/40 transition-all"
                      defaultValue="hhttps://api.bdcourier.com/courier-check"
                    />
                    <Globe className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/30 group-focus-within:text-primary transition-colors" size={18} />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-surface-container-low w-fit px-5 py-3 rounded-xl border border-outline-variant/10">
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" id="isActive" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                </div>
                <label htmlFor="isActive" className="text-xs font-bold uppercase tracking-widest text-on-surface-variant cursor-pointer select-none">
                  Live Status
                </label>
              </div>

              <div className="pt-4">
                <button 
                  type="button" 
                  className="bg-primary hover:bg-primary/90 text-on-primary px-10 py-4 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20 active:scale-[0.98] uppercase tracking-widest"
                >
                  Save and Connect
                </button>
              </div>
            </form>
          </div>
        </section>
        )}

        {activeTab === 'courier' && (
        <div className="space-y-8">
          <section className="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/10 shadow-sm">
            <div className="bg-surface-container-high/50 px-8 py-5 border-b border-outline-variant/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Truck className="text-secondary" size={20} />
                <h3 className="text-on-surface font-bold">Manage Couriers</h3>
              </div>
              <button className="bg-secondary/10 hover:bg-secondary/20 text-secondary w-8 h-8 rounded-lg flex items-center justify-center transition-all">
                <Plus size={20} />
              </button>
            </div>
            
            <div className="p-8">
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant block ml-1">Courier Provider</label>
                    <select className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 text-sm text-on-surface focus:ring-2 focus:ring-secondary/40 transition-all appearance-none outline-none">
                      <option>Steadfast Courier</option>
                      <option>Pathao Logistics</option>
                      <option>RedX Delivery</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant block ml-1">Provider Link</label>
                    <input 
                      type="text" 
                      placeholder="https://api.provider.com/v1"
                      className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 text-sm text-on-surface focus:ring-2 focus:ring-secondary/40 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant block ml-1">Login Details</label>
                  <div className="bg-surface-container-low rounded-2xl border border-outline-variant/10 overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-surface-container-high/50 text-on-surface-variant">
                        <tr>
                          <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest w-16">SN</th>
                          <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest">Name</th>
                          <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest">Value</th>
                          <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-center w-24">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/5">
                        <tr className="hover:bg-surface-container-high/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                              <Plus size={14} />
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <input type="text" placeholder="Api-Key" className="w-full bg-transparent border-none p-0 text-sm focus:ring-0 text-on-surface placeholder:text-on-surface-variant/30" />
                          </td>
                          <td className="px-6 py-4">
                            <input type="password" placeholder="••••••••••••••••" className="w-full bg-transparent border-none p-0 text-sm focus:ring-0 text-on-surface placeholder:text-on-surface-variant/30 font-mono" />
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button type="button" className="text-error hover:scale-110 transition-transform p-2">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button 
                    type="button" 
                    className="bg-secondary hover:bg-secondary/90 text-on-secondary px-8 py-3.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-secondary/20 active:scale-[0.98] uppercase tracking-widest"
                  >
                    Add Courier
                  </button>
                </div>
              </form>
            </div>
            

          </section>
        </div>
        )}

        {activeTab === 'webhook' && (
        <div className="space-y-8">
          <section className="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/10 shadow-sm">
            <div className="bg-surface-container-high/50 px-8 py-5 border-b border-outline-variant/10">
              <div className="flex items-center gap-3">
                <Activity className="text-tertiary" size={20} />
                <h3 className="text-on-surface font-bold">Automatic Notifications</h3>
              </div>
            </div>
            
            <div className="p-8 flex flex-col lg:flex-row gap-12">
              <div className="lg:w-80 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant block ml-1">Select Courier</label>
                  <select className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 text-sm text-on-surface focus:ring-2 focus:ring-tertiary/40 transition-all appearance-none outline-none">
                    <option>Steadfast Courier</option>
                    <option>Pathao Logistics</option>
                  </select>
                </div>
                <button 
                  type="button" 
                  className="w-full bg-tertiary hover:bg-tertiary/90 text-on-tertiary px-8 py-4 rounded-xl text-sm font-bold transition-all shadow-lg shadow-tertiary/20 active:scale-[0.98] uppercase tracking-widest"
                >
                  Get Security Key
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
