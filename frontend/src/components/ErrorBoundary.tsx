import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { translate } from '../i18n';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message?: string;
}

/** Catches render-time errors so a broken page does not blank the whole app. */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Eroare neprevăzută în interfață:', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <AlertTriangle size={48} className="text-danger-500" />
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
          {translate('errorTitle')}
        </h1>
        <p className="max-w-md text-sm text-surface-500 dark:text-surface-400">
          {this.state.message ?? translate('errUnexpected')}
        </p>
        <button type="button" className="btn-primary" onClick={() => window.location.reload()}>
          {translate('reloadPage')}
        </button>
      </div>
    );
  }
}
