import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Mail, Lock, ArrowRight, Eye, EyeOff, ShieldCheck, Globe, Cpu, Check } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '@/src/context/AuthContext';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@ordershield.com.bd');
  const [password, setPassword] = useState('12345678');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login({ email, password, rememberMe });
      onLogin();
    } catch (err: any) {
      if (err.response?.data?.debug) {
        setError('Debug Info: ' + JSON.stringify(err.response.data));
      } else if (err.response?.data?.errors) {
        setError('Validation Error: ' + JSON.stringify(err.response.data.errors));
      } else {
        setError('Error: ' + err.message + ' | ' + (err.response ? JSON.stringify(err.response.data) : 'No Response'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4 font-sans">
      {/* Dynamic Security Grid Overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:40px_40px] opacity-20" />
      
      {/* Decorative Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '3s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px] relative z-10"
      >
        {/* Brand Logo */}
        <div className="flex flex-col items-center mb-12">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="relative mb-6"
          >
            <div className="w-24 h-24 rounded-[2rem] bg-surface-container-high flex items-center justify-center shadow-[0_30px_70px_rgba(0,0,0,0.6)] border border-outline-variant/20 relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <Shield size={48} className="text-primary relative z-10" strokeWidth={1.5} />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-secondary rounded-full border-4 border-background shadow-[0_0_20px_#4ae176]" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <h1 className="text-4xl font-black text-on-surface tracking-tighter uppercase italic">OrderShield</h1>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="h-px w-8 bg-outline-variant/30" />
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Order Management Hub</p>
              <div className="h-px w-8 bg-outline-variant/30" />
            </div>
          </motion.div>
        </div>

        {/* Login Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-surface-container-low/40 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-outline-variant/10 shadow-[0_50px_100px_rgba(0,0,0,0.4)] relative"
        >


          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-error/10 border border-error/20 p-4 rounded-2xl flex items-center gap-3 mb-4 overflow-hidden"
                >
                  <AlertCircle className="text-error" size={18} />
                  <p className="text-[11px] font-bold text-error uppercase tracking-tight leading-tight">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant px-1 flex items-center gap-2">
                <Mail size={12} className="text-primary" /> Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  className="w-full bg-surface-container-low/50 border border-outline-variant/10 rounded-2xl px-5 py-4 text-sm text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-low transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant px-1 flex items-center gap-2">
                <Lock size={12} className="text-primary" /> Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-surface-container-low/50 border border-outline-variant/10 rounded-2xl px-5 py-4 pr-12 text-sm text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-low transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div 
                  onClick={() => setRememberMe(!rememberMe)}
                  className={cn(
                    "w-5 h-5 rounded-lg border-2 transition-all flex items-center justify-center",
                    rememberMe ? 'bg-primary border-primary shadow-[0_0_10px_rgba(79,70,229,0.4)]' : 'border-outline-variant group-hover:border-primary/50'
                  )}
                >
                  {rememberMe && <Check size={12} strokeWidth={4} className="text-white" />}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant group-hover:text-on-surface transition-colors">Remember</span>
              </label>
              <button 
                type="button" 
                onClick={() => setError('Please contact support to reset your password.')}
                className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline underline-offset-4 transition-all"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-black text-xs uppercase tracking-[0.2em] shadow-[0_15px_45px_rgba(79,70,229,0.4)] hover:shadow-[0_20px_60px_rgba(79,70,229,0.5)] hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-4 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <div className="flex items-center gap-4">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="italic">Logging in...</span>
                </div>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Quick Access Section */}
            <div className="pt-6 border-t border-outline-variant/10">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-on-surface-variant text-center mb-4 opacity-50">Quick Authorization</p>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@gmail.com');
                  setPassword('12345678');
                  setTimeout(() => {
                    const form = document.querySelector('form');
                    form?.requestSubmit();
                  }, 100);
                }}
                className="w-full py-4 rounded-xl bg-surface-container-high/30 border border-outline-variant/10 text-on-surface-variant hover:text-primary hover:bg-primary/5 hover:border-primary/20 transition-all flex items-center justify-center gap-3 group"
              >
                <ShieldCheck size={16} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Admin Quick Access</span>
              </button>
            </div>
          </form>

          {/* Compliance Footnote */}
          <div className="mt-12 flex items-center justify-center gap-4 opacity-30 grayscale">
            <ShieldCheck size={16} />
            <Globe size={16} />
            <Cpu size={16} />
          </div>
        </motion.div>


      </motion.div>
    </div>
  );
};

const AlertCircle = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
