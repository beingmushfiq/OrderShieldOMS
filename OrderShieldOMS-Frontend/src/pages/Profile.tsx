import React from 'react';
import { motion } from 'motion/react';
import { Eye } from 'lucide-react';

export const Profile: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto p-6 md:p-12 min-h-screen"
    >
      <header className="mb-12">
        <h2 className="text-4xl font-bold tracking-tight text-on-surface mb-2">User Profile</h2>
        <p className="text-on-surface-variant max-w-xl">
          Manage your account information and security settings.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Update User Profile */}
        <section className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100">
            <h3 className="text-gray-700 font-medium text-lg">Update User Profile</h3>
          </div>
          
          <div className="p-6">
            <p className="text-xs text-gray-500 italic mb-6">
              The field labels marked with * are required input fields.
            </p>

            <form className="space-y-6">
              <div>
                <label className="text-xs text-gray-700 block mb-1">UserName *</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#7c3aed] focus:border-[#7c3aed]"
                  defaultValue="demo"
                />
              </div>
              
              <div>
                <label className="text-xs text-gray-700 block mb-1">Email *</label>
                <input 
                  type="email" 
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#7c3aed] focus:border-[#7c3aed]"
                  defaultValue="demo@gmail.com"
                />
              </div>

              <div>
                <label className="text-xs text-gray-700 block mb-1">Phone Number *</label>
                <input 
                  type="tel" 
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#7c3aed] focus:border-[#7c3aed]"
                  defaultValue="01727663254"
                />
              </div>

              <div>
                <label className="text-xs text-gray-700 block mb-1">Company Name</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#7c3aed] focus:border-[#7c3aed]"
                  defaultValue="OrderShield"
                />
              </div>

              <div>
                <button 
                  type="button" 
                  className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-6 py-2 rounded text-sm font-medium transition-colors shadow-sm"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Change Password */}
        <section className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden h-fit">
          <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100">
            <h3 className="text-gray-700 font-medium text-lg">Change Password</h3>
          </div>
          
          <div className="p-6">
            <form className="space-y-6">
              <div>
                <label className="text-xs text-gray-700 block mb-1">Current Password *</label>
                <div className="relative">
                  <input 
                    type="password" 
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#7c3aed] focus:border-[#7c3aed]"
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <Eye size={16} />
                  </button>
                </div>
              </div>
              
              <div>
                <label className="text-xs text-gray-700 block mb-1">New Password *</label>
                <div className="relative">
                  <input 
                    type="password" 
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#7c3aed] focus:border-[#7c3aed]"
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <Eye size={16} />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-700 block mb-1">Confirm Password *</label>
                <div className="relative">
                  <input 
                    type="password" 
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#7c3aed] focus:border-[#7c3aed]"
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <Eye size={16} />
                  </button>
                </div>
              </div>

              <div>
                <button 
                  type="button" 
                  className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-6 py-2 rounded text-sm font-medium transition-colors shadow-sm"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </section>

      </div>
    </motion.div>
  );
};
