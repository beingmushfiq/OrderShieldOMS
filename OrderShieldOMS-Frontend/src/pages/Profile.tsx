import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Eye, 
  EyeOff, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Lock, 
  ShieldCheck,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { cn } from '@/src/lib/utils';
import api from '@/src/lib/api';
import { toast } from 'sonner';

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  
  // Profile State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: user?.company || ''
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password State
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const response = await api.put('/user/profile', profileData);
      toast.success(response.data.message);
      updateUser(response.data.user);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      return toast.error('Passwords do not match');
    }

    setIsChangingPassword(true);
    try {
      const response = await api.put('/user/password', passwordData);
      toast.success(response.data.message);
      setPasswordData({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto p-6 md:p-12 min-h-screen pb-32"
    >
      <header className="mb-16">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/20">
            <User size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-on-surface uppercase italic">My Profile</h1>
            <p className="text-on-surface-variant font-medium">Update your personal information and security settings.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Profile Card & Actions */}
        <div className="lg:col-span-5 space-y-8">
          <section className="bg-surface-container-low rounded-[2.5rem] border border-outline-variant/10 shadow-2xl overflow-hidden relative group">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary to-primary-container opacity-10 group-hover:opacity-20 transition-opacity" />
            
            <div className="pt-16 pb-10 px-10 text-center relative z-10">
              <div className="relative inline-block mb-6">
                <img 
                  src={user?.avatar} 
                  alt={user?.name} 
                  className="w-32 h-32 rounded-[2rem] border-4 border-surface shadow-2xl object-cover"
                />
                <div className="absolute -bottom-2 -right-2 bg-secondary text-on-secondary p-2.5 rounded-2xl shadow-xl border-4 border-surface group-hover:scale-110 transition-transform">
                  <ShieldCheck size={20} />
                </div>
              </div>
              
              <h3 className="text-2xl font-black text-on-surface tracking-tight uppercase italic">{user?.name}</h3>
              <p className="text-on-surface-variant font-mono text-sm mt-1 uppercase tracking-widest">{user?.role} • Active Account</p>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/10">
                  <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Status</p>
                  <div className="flex items-center justify-center gap-2 text-secondary">
                    <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                    <span className="text-sm font-bold uppercase tracking-tighter">Verified</span>
                  </div>
                </div>
                <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/10">
                  <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Activity</p>
                  <span className="text-sm font-bold uppercase tracking-tighter text-on-surface">Active</span>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column: Forms */}
        <div className="lg:col-span-7 space-y-12">
          
          {/* Profile Form */}
          <section className="bg-surface-container-low rounded-[3rem] border border-outline-variant/10 shadow-2xl overflow-hidden">
             <div className="px-10 py-8 bg-surface-container-high/50 border-b border-outline-variant/10 flex items-center justify-between">
              <h3 className="font-black text-xl tracking-tight uppercase italic flex items-center gap-3">
                <User className="text-primary" size={20} />
                Personal Information
              </h3>
            </div>
            
            <form onSubmit={handleProfileSubmit} className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant px-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={18} />
                    <input 
                      type="text" 
                      required
                      value={profileData.name}
                      onChange={e => setProfileData({...profileData, name: e.target.value})}
                      className="w-full bg-surface-container border border-outline-variant/10 rounded-2xl pl-12 pr-4 py-4 text-on-surface font-bold focus:ring-2 focus:ring-primary/40 transition-all outline-none shadow-inner"
                      placeholder="e.g. Aayan"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant px-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={18} />
                    <input 
                      type="email" 
                      required
                      value={profileData.email}
                      onChange={e => setProfileData({...profileData, email: e.target.value})}
                      className="w-full bg-surface-container border border-outline-variant/10 rounded-2xl pl-12 pr-4 py-4 text-on-surface font-bold focus:ring-2 focus:ring-primary/40 transition-all outline-none shadow-inner"
                      placeholder="admin@gmail.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant px-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={18} />
                    <input 
                      type="tel" 
                      value={profileData.phone}
                      onChange={e => setProfileData({...profileData, phone: e.target.value})}
                      className="w-full bg-surface-container border border-outline-variant/10 rounded-2xl pl-12 pr-4 py-4 text-on-surface font-bold focus:ring-2 focus:ring-primary/40 transition-all outline-none shadow-inner"
                      placeholder="+880 1XXX XXXXXX"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant px-1">Company Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={18} />
                    <input 
                      type="text" 
                      value={profileData.company}
                      onChange={e => setProfileData({...profileData, company: e.target.value})}
                      className="w-full bg-surface-container border border-outline-variant/10 rounded-2xl pl-12 pr-4 py-4 text-on-surface font-bold focus:ring-2 focus:ring-primary/40 transition-all outline-none shadow-inner"
                      placeholder="OrderShield OMS"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isUpdatingProfile}
                  className="w-full md:w-auto bg-primary text-on-primary px-10 py-4 rounded-[1.5rem] text-sm font-black uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isUpdatingProfile ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* Password Form */}
          <section className="bg-surface-container-low rounded-[3rem] border border-outline-variant/10 shadow-2xl overflow-hidden">
            <div className="px-10 py-8 bg-surface-container-high/50 border-b border-outline-variant/10 flex items-center justify-between">
              <h3 className="font-black text-xl tracking-tight uppercase italic flex items-center gap-3">
                <Lock className="text-secondary" size={20} />
                Change Password
              </h3>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="p-10 space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant px-1">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={18} />
                    <input 
                      type={showPasswords.current ? "text" : "password"}
                      required
                      value={passwordData.current_password}
                      onChange={e => setPasswordData({...passwordData, current_password: e.target.value})}
                      className="w-full bg-surface-container border border-outline-variant/10 rounded-2xl pl-12 pr-12 py-4 text-on-surface font-bold focus:ring-2 focus:ring-secondary/40 transition-all outline-none shadow-inner"
                      placeholder="••••••••"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                    >
                      {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant px-1">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={18} />
                      <input 
                        type={showPasswords.new ? "text" : "password"}
                        required
                        value={passwordData.new_password}
                        onChange={e => setPasswordData({...passwordData, new_password: e.target.value})}
                        className="w-full bg-surface-container border border-outline-variant/10 rounded-2xl pl-12 pr-12 py-4 text-on-surface font-bold focus:ring-2 focus:ring-secondary/40 transition-all outline-none shadow-inner"
                        placeholder="Min 8 characters"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                      >
                        {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant px-1">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={18} />
                      <input 
                        type={showPasswords.confirm ? "text" : "password"}
                        required
                        value={passwordData.new_password_confirmation}
                        onChange={e => setPasswordData({...passwordData, new_password_confirmation: e.target.value})}
                        className="w-full bg-surface-container border border-outline-variant/10 rounded-2xl pl-12 pr-12 py-4 text-on-surface font-bold focus:ring-2 focus:ring-secondary/40 transition-all outline-none shadow-inner"
                        placeholder="••••••••"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                      >
                        {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isChangingPassword}
                  className="w-full md:w-auto bg-secondary text-on-secondary px-10 py-4 rounded-[1.5rem] text-sm font-black uppercase tracking-widest shadow-2xl shadow-secondary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isChangingPassword ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

        </div>
      </div>
    </motion.div>
  );
};
