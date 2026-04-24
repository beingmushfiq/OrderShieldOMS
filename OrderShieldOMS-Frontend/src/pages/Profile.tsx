import React from 'react';
import { motion } from 'motion/react';
import { Eye, User, Lock, Mail, Phone, Building, Save, Shield } from 'lucide-react';

export const Profile: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-6 py-8"
    >
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <User size={24} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-on-surface">My Account</h2>
        </div>
        <p className="text-on-surface-variant max-w-xl text-sm">
          Update your personal details, contact info, and password.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Update User Profile */}
        <section className="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/10 shadow-sm">
          <div className="bg-surface-container-high/50 px-8 py-5 border-b border-outline-variant/10 flex items-center gap-3">
            <Shield className="text-primary" size={20} />
            <h3 className="text-on-surface font-bold">My Info</h3>
          </div>
          
          <div className="p-8">
            <p className="text-xs text-on-surface-variant/70 italic mb-8 flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-primary" />
              Your basic account information
            </p>

            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant block ml-1">Username *</label>
                <div className="relative group">
                  <input 
                    type="text" 
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 text-sm text-on-surface focus:ring-2 focus:ring-primary/40 transition-all font-bold"
                    defaultValue="demo_admin"
                  />
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/30 group-focus-within:text-primary transition-colors" size={18} />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant block ml-1">Email *</label>
                <div className="relative group">
                  <input 
                    type="email" 
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 text-sm text-on-surface focus:ring-2 focus:ring-primary/40 transition-all"
                    defaultValue="admin@ordershield.com.bd"
                  />
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/30 group-focus-within:text-primary transition-colors" size={18} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant block ml-1">Phone Number *</label>
                <div className="relative group">
                  <input 
                    type="tel" 
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 text-sm text-on-surface focus:ring-2 focus:ring-primary/40 transition-all font-mono"
                    defaultValue="+880 1727-663254"
                  />
                  <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/30 group-focus-within:text-primary transition-colors" size={18} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant block ml-1">Company Name</label>
                <div className="relative group">
                  <input 
                    type="text" 
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 text-sm text-on-surface focus:ring-2 focus:ring-primary/40 transition-all"
                    defaultValue="OrderShield Logistics Group"
                  />
                  <Building className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/30 group-focus-within:text-primary transition-colors" size={18} />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="button" 
                  className="w-full bg-primary hover:bg-primary/90 text-on-primary px-8 py-4 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20 active:scale-[0.98] uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Change Password */}
        <section className="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/10 shadow-sm h-fit">
          <div className="bg-surface-container-high/50 px-8 py-5 border-b border-outline-variant/10 flex items-center gap-3">
            <Lock className="text-secondary" size={20} />
            <h3 className="text-on-surface font-bold">Change Password</h3>
          </div>
          
          <div className="p-8">
            <p className="text-xs text-on-surface-variant/70 italic mb-8 flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-secondary" />
              Update your password to keep your account safe
            </p>

            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant block ml-1">Current Password *</label>
                <div className="relative group">
                  <input 
                    type="password" 
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 text-sm text-on-surface focus:ring-2 focus:ring-secondary/40 transition-all font-mono"
                    placeholder="••••••••••••"
                  />
                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/30 hover:text-secondary transition-colors">
                    <Eye size={18} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant block ml-1">New Password *</label>
                <div className="relative group">
                  <input 
                    type="password" 
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 text-sm text-on-surface focus:ring-2 focus:ring-secondary/40 transition-all font-mono"
                    placeholder="••••••••••••"
                  />
                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/30 hover:text-secondary transition-colors">
                    <Eye size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant block ml-1">Confirm New Password *</label>
                <div className="relative group">
                  <input 
                    type="password" 
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 text-sm text-on-surface focus:ring-2 focus:ring-secondary/40 transition-all font-mono"
                    placeholder="••••••••••••"
                  />
                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/30 hover:text-secondary transition-colors">
                    <Eye size={18} />
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="button" 
                  className="w-full bg-secondary hover:bg-secondary/90 text-on-secondary px-8 py-4 rounded-xl text-sm font-bold transition-all shadow-lg shadow-secondary/20 active:scale-[0.98] uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Lock size={18} />
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </section>

      </div>
    </motion.div>
  );
};
