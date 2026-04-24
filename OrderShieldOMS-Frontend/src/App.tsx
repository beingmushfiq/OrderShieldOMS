import React, { useState } from 'react';
import { Sidebar } from '@/src/components/layout/Sidebar';
import { TopBar } from '@/src/components/layout/TopBar';
import { BottomNav } from '@/src/components/layout/BottomNav';
import { Dashboard } from '@/src/pages/Dashboard';
import { Orders } from '@/src/pages/Orders';
import { CreateOrder } from '@/src/pages/CreateOrder';
import { Products } from '@/src/pages/Products';
import { Alerts } from '@/src/pages/Alerts';
import { Settings } from '@/src/pages/Settings';
import { Tracking } from '@/src/pages/Tracking';
import { Invoices } from '@/src/pages/Invoices';
import { Login } from '@/src/pages/Login';
import { Users } from '@/src/pages/Users';
import { Profile } from '@/src/pages/Profile';
import { Page } from '@/src/types';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from '@/src/context/AuthContext';
import { ErrorBoundary } from '@/src/components/layout/ErrorBoundary';

function AppContent() {
  const { user, logout, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('dash');

  const getPageTitle = (page: Page) => {
    switch (page) {
      case 'dash': return 'Dashboard';
      case 'orders': return 'Orders';
      case 'create': return 'Create Order';
      case 'alerts': return 'Fraud Protection';
      case 'users': return 'Customers';
      case 'settings': 
      case 'settings-courier':
      case 'settings-fraud':
      case 'settings-webhook': return 'Settings';
      case 'profile': return 'My Account';
      case 'tracking': return 'Delivery Tracking';
      case 'invoices': return 'Invoices';
      case 'products': return 'Products';
      default: return 'Dashboard';
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dash': return <Dashboard onPageChange={setCurrentPage} />;
      case 'orders': return <Orders />;
      case 'create': return <CreateOrder />;
      case 'alerts': return <Alerts />;
      case 'users': return <Users />;
      case 'settings': return <Settings activeTab="courier" />; // default to courier or redirect
      case 'settings-courier': return <Settings activeTab="courier" />;
      case 'settings-fraud': return <Settings activeTab="fraud" />;
      case 'settings-webhook': return <Settings activeTab="webhook" />;
      case 'profile': return <Profile />;
      case 'tracking': return <Tracking />;
      case 'invoices': return <Invoices />;
      case 'products': return <Products />;
      default: return <Dashboard onPageChange={setCurrentPage} />;
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentPage('dash');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={() => {/* navigate is handled by state change in AuthContext */}} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row relative overflow-hidden">
      {/* Immersive Background Elements */}
      <div className="fixed top-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="fixed -bottom-20 -left-20 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />
      
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} onLogout={handleLogout} />
      
      <main className="flex-1 md:ml-72 min-h-screen flex flex-col pb-24 md:pb-0">
        <TopBar 
          currentPage={currentPage} 
          title={getPageTitle(currentPage)} 
          onPageChange={setCurrentPage} 
        />
        
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <ErrorBoundary>
            {renderPage()}
          </ErrorBoundary>
        </div>
      </main>

      <BottomNav currentPage={currentPage} onPageChange={setCurrentPage} />
      <Toaster position="top-right" expand={false} richColors theme="dark" />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
