import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, 
  Search, 
  CheckCircle, 
  ChevronRight, 
  X,
  MapPin,
  Activity
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useAuth } from '@/src/context/AuthContext';

const flaggedUsers: any[] = [];



export const Alerts: React.FC = () => {
  const { user: authUser } = useAuth();
  const isAdmin = authUser?.role === 'admin';
  const isManager = authUser?.role === 'manager' || isAdmin;

  const [selectedId, setSelectedId] = useState('1');
  const selectedUser = flaggedUsers.find(u => u.id === selectedId) || flaggedUsers[0];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 md:p-8 lg:p-12"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">Fraud Alerts</h1>
          <p className="text-on-surface-variant max-w-xl">Live security monitoring. Orders that look suspicious for your review.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 rounded-md bg-surface-container-high text-on-surface font-semibold text-sm hover:bg-surface-container-highest transition-colors">
            Export Report
          </button>
          {isAdmin && (
            <button className="px-6 py-3 rounded-md bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-sm shadow-lg hover:brightness-110 transition-all">
              Bulk Clear
            </button>
          )}
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: 'High Risk Flagged', value: '0', change: 'None', color: 'border-error' },
          { label: 'Suspicious Activity', value: '0', change: 'None', color: 'border-tertiary' },
          { label: 'Average Risk Score', value: '0', change: 'Optimal', color: 'border-secondary' },
        ].map((stat) => (
          <div key={stat.label} className={cn("bg-surface-container rounded-lg p-6 flex flex-col justify-between border-l-4", stat.color)}>
            <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">{stat.label}</span>
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl font-bold text-white">{stat.value}</span>
              <span className={cn("text-sm font-medium", stat.color.replace('border-', 'text-'))}>{stat.change}</span>
            </div>
          </div>
        ))}
      </section>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-white">High Risk Orders</h2>
            <div className="flex items-center gap-2 text-on-surface-variant text-sm bg-surface-container-high px-3 py-1 rounded-full">
              <Search size={14} />
              <span>Filter: Score &gt; 80</span>
            </div>
          </div>

          {flaggedUsers.length === 0 ? (
            <div className="p-12 text-center bg-surface-container-low border border-dashed border-outline-variant/20 rounded-2xl">
              <CheckCircle className="mx-auto text-secondary/50 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">All Clear</h3>
              <p className="text-sm text-on-surface-variant">No suspicious orders detected at this time.</p>
            </div>
          ) : flaggedUsers.map((user) => (
            <div 
              key={user.id}
              onClick={() => setSelectedId(user.id)}
              className={cn(
                "bg-surface-container hover:bg-surface-container-high transition-all rounded-xl p-5 cursor-pointer flex items-center gap-6 group",
                selectedId === user.id && "ring-1 ring-primary/40 bg-surface-container-high"
              )}
            >
              <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", user.bgColor)}>
                <user.icon className={user.color} size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-white">{user.email}</h3>
                  <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter", user.bgColor, user.color)}>
                    {user.risk}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">{user.detail}</p>
              </div>
              <div className="hidden md:flex flex-col items-end gap-1">
                <span className="text-white font-mono font-bold text-lg">{user.score}/100</span>
                <span className="text-[10px] text-on-surface-variant uppercase font-bold">Risk Score</span>
              </div>
              <ChevronRight className="text-on-surface-variant group-hover:text-primary transition-colors" size={20} />
            </div>
          ))}
        </div>

        <aside className="w-full lg:w-[420px] bg-surface-container-highest/40 border border-outline-variant/10 rounded-2xl p-8 sticky top-12 h-fit">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white">Analysis</h3>
            <X className="text-on-surface-variant cursor-pointer" size={24} />
          </div>
          {selectedUser ? (
            <div className="space-y-8">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-background/50">
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center border-2",
                  selectedUser.score >= 80 ? "bg-error-container/30 text-error border-error/50" :
                  selectedUser.score >= 50 ? "bg-tertiary-container/30 text-tertiary border-tertiary/50" :
                  "bg-secondary/10 text-secondary border-secondary/50"
                )}>
                  <span className="text-2xl font-bold">{selectedUser.score}</span>
                </div>
                <div>
                  <h4 className="font-bold text-white">
                    {selectedUser.score >= 80 ? 'Very High Risk' : selectedUser.score >= 50 ? 'Medium Risk' : 'Low Risk'}
                  </h4>
                  <p className="text-xs text-on-surface-variant">{selectedUser.detail.split('•')[1]?.trim() || 'Checking...'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/20 pb-2">Analysis Details</p>
                {[
                  { label: 'IP Address', value: selectedUser.score >= 80 ? 'Suspicious' : 'Clean', color: selectedUser.score >= 80 ? 'text-error' : 'text-secondary' },
                  { label: 'Location Type', value: selectedUser.score >= 80 ? 'Hidden' : 'Normal', color: selectedUser.score >= 80 ? 'text-error' : 'text-secondary' },
                  { label: 'Order Frequency', value: selectedUser.score >= 50 ? 'Too Many (8/hr)' : 'Normal (2/hr)', color: selectedUser.score >= 50 ? 'text-tertiary' : 'text-secondary' },
                  { label: 'Device', value: selectedUser.score >= 80 ? 'Suspicious' : 'Trusted', color: selectedUser.score >= 80 ? 'text-tertiary' : 'text-secondary' },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center text-sm">
                    <span className="text-on-surface-variant">{item.label}</span>
                    <span className={cn("font-medium", item.color)}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="h-40 w-full rounded-xl bg-surface-container-high overflow-hidden relative">
                <img 
                  className="w-full h-full object-cover opacity-50 grayscale" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvDLPyeysA1LKwSheeAydwO1RW6_muJWWLMw4W3wVqCDka_vU0Yw8SGB6iW-_MAVVp2tsWgV-7bVkUSr8N6ajNcHjsDoQ_5yfqd6f3P6MwW7rdMy5zDCmKQTGBXynNKM_s3TMSXCSH2KAEb3cVznT-OGl7bWQpMgIdKfg3t0tWPamHsl6JxMucA9SQSWNS2plNkT9lo-aHSOI2g7ooHWuhGUaDLdSf3jBSJ52_oTMMifmfsBbKEVjRA86a4AhxkElcA5nzU47iJrU" 
                  alt="Map"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-highest to-transparent"></div>
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-error/90 text-on-error px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
                  <MapPin size={12} />
                  Flagged Location
                </div>
              </div>

              {isManager && (
                <div className="pt-6 grid grid-cols-2 gap-4">
                  <button className="px-4 py-3 rounded-lg border border-outline-variant/30 text-white font-semibold text-sm hover:bg-surface-container-highest transition-colors">
                    Allow Order
                  </button>
                  <button className="px-4 py-3 rounded-lg bg-error text-on-error font-bold text-sm shadow-[0_0_20px_rgba(255,180,171,0.2)] hover:brightness-110 transition-all">
                    Block Order
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <ShieldAlert size={48} className="text-on-surface-variant/20" />
              <p className="text-on-surface-variant font-medium">No alerts selected or available for analysis.</p>
            </div>
          )}
        </aside>
      </div>
    </motion.div>
  );
};
