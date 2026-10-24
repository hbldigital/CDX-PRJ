/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CODELIX Official Web Application
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { NewsletterRibbon } from './components/NewsletterRibbon';
import { AuthModal } from './pages/Auth/AuthModal';

import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Offers } from './pages/Offers';
import { Portfolio } from './pages/Portfolio';
import { Contact } from './pages/Contact';
import { Careers } from './pages/Careers';
import { ApplicationTracking } from './pages/ApplicationTracking';
import { Cart } from './pages/Cart';
import { CustomerDashboard } from './pages/Customer/CustomerDashboard';
import { EmployeeDashboard } from './pages/Employee/EmployeeDashboard';
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { LegalPage } from './pages/Legal/LegalPage';

function getInitialView(): string {
  if (typeof window !== 'undefined' && window.location.hash) {
    const raw = window.location.hash.replace(/^#\/?/, '').trim();
    if (raw) {
      const parts = raw.split('?');
      return parts[0] || 'home';
    }
  }
  return 'home';
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('CODELIX ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6">
          <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-14 h-14 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-2xl">!</div>
            <h2 className="text-xl font-bold mb-2">Application Notice</h2>
            <p className="text-sm text-slate-400 mb-6">
              The page encountered an unexpected state. Click below to reload cleanly.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.hash = '';
                window.location.reload();
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all cursor-pointer"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function AppContent() {
  const [currentView, setCurrentView] = useState<string>(getInitialView);
  const [viewParams, setViewParams] = useState<any>({});
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  const navigateTo = (view: string, params: any = {}) => {
    setCurrentView(view);
    setViewParams(params);
    if (typeof window !== 'undefined') {
      window.location.hash = view;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  // Sync back/forward button clicks via hashchange
  useEffect(() => {
    const handleHashChange = () => {
      const target = getInitialView();
      setCurrentView(target);
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Ensure scroll to top on any view change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [currentView]);

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 selection:bg-cyan-500 selection:text-white">
      {/* Sticky Header */}
      <Navbar
        currentView={currentView}
        onNavigate={navigateTo}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Animated 10% Discount Newsletter Ribbon */}
      <NewsletterRibbon onNavigate={navigateTo} />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && <Home onNavigate={navigateTo} />}

        {currentView === 'about' && <About onNavigate={navigateTo} />}

        {currentView === 'services' && (
          <Services
            onNavigate={navigateTo}
            initialCategory={viewParams?.category}
          />
        )}

        {currentView === 'offers' && <Offers onNavigate={navigateTo} />}

        {currentView === 'portfolio' && <Portfolio onNavigate={navigateTo} />}

        {currentView === 'careers' && <Careers onNavigate={navigateTo} />}

        {currentView === 'track-application' && (
          <ApplicationTracking
            initialReference={viewParams?.reference}
            initialEmail={viewParams?.email}
          />
        )}

        {currentView === 'contact' && (
          <Contact
            initialTab={viewParams?.tab || 'quote'}
            initialService={viewParams?.service}
          />
        )}

        {currentView === 'cart' && <Cart onNavigate={navigateTo} />}

        {currentView === 'customer-dashboard' && (
          <CustomerDashboard
            onNavigate={navigateTo}
            initialTab={viewParams?.tab || 'overview'}
          />
        )}

        {currentView === 'employee-dashboard' && (
          <EmployeeDashboard onNavigate={navigateTo} />
        )}

        {currentView === 'admin-dashboard' && (
          <AdminDashboard
            onNavigate={navigateTo}
            initialTab={viewParams?.tab || 'overview'}
          />
        )}

        {currentView === 'legal' && (
          <LegalPage
            initialTab={viewParams?.tab || 'privacy'}
            onNavigate={navigateTo}
          />
        )}
      </main>

      {/* Official Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Authentication & Verification Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
