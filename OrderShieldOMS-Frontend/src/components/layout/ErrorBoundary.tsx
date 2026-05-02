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
          <h2 className="text-2xl font-black mb-4">Application Exception</h2>
          <div className="bg-error/5 border border-error/20 rounded-2xl p-6 mb-8 max-w-2xl w-full text-left overflow-hidden">
            <div className="flex items-center gap-2 text-error mb-3">
              <AlertTriangle size={16} />
              <p className="font-black text-[10px] uppercase tracking-[0.2em]">Diagnostic Report</p>
            </div>
            <p className="text-on-surface font-mono text-sm break-words whitespace-pre-wrap mb-4 bg-background/40 p-4 rounded-xl border border-outline-variant/10">
              {this.state.error?.message || 'An unexpected runtime error occurred while rendering this component.'}
            </p>
            {this.state.error?.stack && (
              <details className="group">
                <summary className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 cursor-pointer hover:text-primary transition-colors select-none flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-error/40 group-open:bg-primary group-open:animate-pulse" />
                  Technical Details
                </summary>
                <pre className="mt-4 text-[10px] bg-background/60 p-4 rounded-xl overflow-auto max-h-60 custom-scrollbar font-mono text-on-surface-variant/80 border border-outline-variant/5">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-primary text-on-primary rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95"
            >
              <RefreshCcw size={18} />
              Restart App
            </button>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-surface-container-highest text-on-surface rounded-xl font-bold uppercase tracking-widest hover:bg-surface-container-highest/80 transition-all active:scale-95 border border-outline-variant/20"
            >
              Attempt Recovery
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
