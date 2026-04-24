import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw, ShieldAlert } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
          <div className="w-20 h-20 bg-error/10 rounded-3xl flex items-center justify-center text-error mb-8 animate-pulse">
            <ShieldAlert size={40} />
          </div>
          <h2 className="text-2xl font-black mb-4">System Update Needed</h2>
          <p className="text-on-surface-variant mb-8 max-w-md">
            We encountered a temporary issue while loading this page. Please try refreshing or contact support if the problem persists.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-3 px-8 py-4 bg-primary text-on-primary rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
          >
            <RefreshCcw size={18} />
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
